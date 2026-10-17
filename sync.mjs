import fs from 'fs';

const token = process.env.SYNC_TOKEN;

if (!token) {
  console.error("❌ Error: SYNC_TOKEN environment variable is not set!");
  process.exit(1);
}

const headers = {
  Accept: "application/vnd.github+json",
  Authorization: `Bearer ${token}`,
  "X-GitHub-Api-Version": "2022-11-28",
  "User-Agent": "fork-auto-sync",
};

// 读取本地配置文件
let config = { exclude: [], only: [] };
try {
  if (fs.existsSync('./config.json')) {
    config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
  }
} catch (e) {
  console.warn("⚠️ Failed to read config.json, using default settings:", e.message);
}

// 网页手动触发参数支持
const targetInput = (process.env.TARGET_REPO || '').trim();
if (targetInput && targetInput.toUpperCase() !== 'ALL') {
  config.only = [targetInput];
}
const isDryRun = process.env.DRY_RUN === 'true';

async function getForks() {
  const forks = [];
  let page = 1;

  while (true) {
    const res = await fetch(
      `https://api.github.com/user/repos?per_page=100&page=${page}`,
      { headers }
    );
    if (!res.ok) {
      throw new Error(`Failed to list repos: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    if (!data || data.length === 0) break;

    // 严格过滤出真正的 Fork 仓库
    const actualForks = data.filter((r) => r.fork === true);
    forks.push(...actualForks);
    page++;
  }

  // 获取每个 Fork 对应的上游 Parent 信息
  const detailedForks = [];
  for (const fork of forks) {
    try {
      const detailRes = await fetch(
        `https://api.github.com/repos/${fork.full_name}`,
        { headers }
      );
      if (detailRes.ok) {
        const detail = await detailRes.json();
        fork.parent_full_name = detail.parent ? detail.parent.full_name : '未知上游';
      } else {
        fork.parent_full_name = '未知上游';
      }
    } catch {
      fork.parent_full_name = '未知上游';
    }
    detailedForks.push(fork);
  }

  return detailedForks;
}

function shouldSync(repo) {
  const name = repo.name.toLowerCase();
  const fullName = repo.full_name.toLowerCase();

  // 如果指定了仅同步列表
  if (config.only && config.only.length > 0) {
    const matched = config.only.some((o) => {
      const lower = o.toLowerCase().trim();
      return lower === name || lower === fullName;
    });
    if (!matched) {
      return { sync: false, reason: '未在指定同步列表 (only) 中' };
    }
  }

  // 如果在排除列表中
  if (config.exclude && config.exclude.length > 0) {
    const excluded = config.exclude.some((e) => {
      const lower = e.toLowerCase().trim();
      return lower === name || lower === fullName;
    });
    if (excluded) {
      return { sync: false, reason: '已配置在排除名单 (exclude) 中' };
    }
  }

  return { sync: true };
}

async function syncFork(repo) {
  const fullName = repo.full_name;
  const parent = repo.parent_full_name;
  const branch = repo.default_branch;

  const check = shouldSync(repo);
  if (!check.sync) {
    console.log(`⏸️ [${fullName}]: 跳过同步 (${check.reason})`);
    return { repo: fullName, url: repo.html_url, parent, branch, status: "skipped", detail: check.reason };
  }

  if (isDryRun) {
    console.log(`🔍 [${fullName}] (${branch}): 预览模式，未做实际合并`);
    return { repo: fullName, url: repo.html_url, parent, branch, status: "dry-run", detail: "预览模式 (未真正合并)" };
  }

  try {
    const res = await fetch(
      `https://api.github.com/repos/${fullName}/merge-upstream`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({ branch }),
      }
    );

    const data = await res.json();

    if (res.status === 200) {
      console.log(`✅ [${fullName}] (${branch}): ${data.message || "同步成功"}`);
      return { repo: fullName, url: repo.html_url, parent, branch, status: "success", detail: data.message || "同步成功" };
    } else if (res.status === 409) {
      let isUpstreamDead = false;
      try {
        if (parent && parent !== '未知上游') {
          const parentRes = await fetch(`https://api.github.com/repos/${parent}`, { headers });
          if (parentRes.status === 404) isUpstreamDead = true;
        }
      } catch (_) {}

      if (isUpstreamDead) {
        console.warn(`📦 [${fullName}] (${branch}): 上游母项目已在 GitHub 被注销或删除 (404)，当前为独立绝版镜像`);
        return { repo: fullName, url: repo.html_url, parent, branch, status: "upstream-deleted", detail: "上游原项目已注销(404)，当前为绝版独立镜像" };
      }

      console.warn(`⚠️ [${fullName}] (${branch}): 存在合并冲突，保持原样`);
      return { repo: fullName, url: repo.html_url, parent, branch, status: "conflict", detail: data.message || "存在代码冲突，已安全保护不合并" };
    } else if (res.status === 422) {
      console.log(`ℹ️ [${fullName}] (${branch}): 已是最新`);
      return { repo: fullName, url: repo.html_url, parent, branch, status: "up-to-date", detail: "已与上游完全一致" };
    } else {
      console.error(`❌ [${fullName}] (${branch}): 错误 ${res.status}: ${data.message}`);
      return { repo: fullName, url: repo.html_url, parent, branch, status: "error", detail: `${res.status}: ${data.message}` };
    }
  } catch (err) {
    console.error(`❌ [${fullName}] (${branch}): 网络异常: ${err.message}`);
    return { repo: fullName, url: repo.html_url, parent, branch, status: "error", detail: err.message };
  }
}

function writeStepSummary(results) {
  const summaryFile = process.env.GITHUB_STEP_SUMMARY;
  if (!summaryFile) return;

  const statusIcons = {
    success: "✅ 成功同步",
    "up-to-date": "ℹ️ 保持最新",
    skipped: "⏸️ 已跳过",
    conflict: "⚠️ 代码冲突",
    "upstream-deleted": "📦 绝版镜像",
    error: "❌ 异常失败",
    "dry-run": "🔍 预览检查",
  };

  const rows = results.map((r, i) => {
    const iconText = statusIcons[r.status] || r.status;
    return `| ${(i + 1).toString().padStart(2, "0")} | [${r.repo}](${r.url}) | \`${r.parent}\` | \`${r.branch}\` | ${iconText} | ${r.detail} |`;
  });

  const successCount = results.filter((r) => r.status === "success").length;
  const upToDateCount = results.filter((r) => r.status === "up-to-date").length;
  const skippedCount = results.filter((r) => r.status === "skipped").length;
  const conflictCount = results.filter((r) => r.status === "conflict").length;
  const upstreamDeletedCount = results.filter((r) => r.status === "upstream-deleted").length;
  const errorCount = results.filter((r) => r.status === "error").length;

  const content = `## 🚀 Fork 自动同步可视化看板

> **触发方式**: ${targetInput && targetInput.toUpperCase() !== 'ALL' ? `指定仓库 (${targetInput})` : '全量 Fork 同步'} | **运行模式**: ${isDryRun ? '仅预览 (Dry Run)' : '自动合并'}

| 序号 | Fork 仓库 | 上游原项目 | 分支 | 状态 | 详细说明 |
| :---: | :--- | :--- | :--- | :---: | :--- |
${rows.join("\n")}

### 📊 本次汇总数据
- **总计扫描 Fork 数**: ${results.length}
- **✅ 新同步提交**: ${successCount} 个
- **ℹ️ 已是最新版本**: ${upToDateCount} 个
- **📦 独立绝版镜像**: ${upstreamDeletedCount} 个
- **⏸️ 规则跳过/锁定**: ${skippedCount} 个
- **⚠️ 冲突安全保护**: ${conflictCount} 个
- **❌ 异常失败**: ${errorCount} 个

---
*💡 想要锁定某个 Fork 不更新？直接在代码仓库中的 \`config.json\` 添加仓库名即可。*
`;

  try {
    fs.appendFileSync(summaryFile, content, "utf8");
    console.log("📝 GitHub Step Summary generated successfully.");
  } catch (err) {
    console.warn("Failed to write to GITHUB_STEP_SUMMARY:", err.message);
  }
}

async function main() {
  console.log("==========================================");
  console.log("🚀 Starting Fork Auto-Sync...");
  console.log("==========================================");

  try {
    const forks = await getForks();
    console.log(`🔍 Found ${forks.length} forked repositories in account.\n`);

    if (forks.length === 0) {
      console.log("No forked repositories found to sync.");
      return;
    }

    const results = [];
    for (const fork of forks) {
      const res = await syncFork(fork);
      results.push(res);
    }

    console.log("\n==========================================");
    console.log("📊 Summary Report:");
    console.log("==========================================");
    const successful = results.filter((r) => r.status === "success" || r.status === "up-to-date").length;
    const skipped = results.filter((r) => r.status === "skipped").length;
    const conflicts = results.filter((r) => r.status === "conflict").length;
    const errors = results.filter((r) => r.status === "error").length;

    console.log(`Total Forks: ${results.length}`);
    console.log(`✅ Synced / Up-to-date: ${successful}`);
    if (skipped > 0) console.log(`⏸️ Skipped: ${skipped}`);
    if (conflicts > 0) console.log(`⚠️ Conflicts: ${conflicts}`);
    if (errors > 0) console.log(`❌ Errors: ${errors}`);
    console.log("==========================================");

    // 生成 GitHub 网页仪表盘报告
    writeStepSummary(results);
  } catch (err) {
    console.error("Fatal error during sync process:", err);
    process.exit(1);
  }
}

main();
