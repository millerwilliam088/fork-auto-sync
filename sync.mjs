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

async function getForks() {
  const forks = [];
  let page = 1;

  while (true) {
    const res = await fetch(
      `https://api.github.com/user/repos?type=forks&per_page=100&page=${page}`,
      { headers }
    );
    if (!res.ok) {
      throw new Error(`Failed to list repos: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    if (!data || data.length === 0) break;
    forks.push(...data);
    page++;
  }

  return forks;
}

async function syncFork(repo) {
  const fullName = repo.full_name;
  const branch = repo.default_branch;

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
      console.log(`✅ [${fullName}] (${branch}): ${data.message || "Synced successfully!"}`);
      return { repo: fullName, status: "success", detail: data.message };
    } else if (res.status === 409) {
      console.warn(`⚠️ [${fullName}] (${branch}): Conflict detected. Manual review required.`);
      return { repo: fullName, status: "conflict", detail: data.message };
    } else if (res.status === 422) {
      console.log(`ℹ️ [${fullName}] (${branch}): Already up to date.`);
      return { repo: fullName, status: "up-to-date", detail: data.message };
    } else {
      console.error(`❌ [${fullName}] (${branch}): Error ${res.status}: ${data.message}`);
      return { repo: fullName, status: "error", detail: data.message };
    }
  } catch (err) {
    console.error(`❌ [${fullName}] (${branch}): Network/Request error: ${err.message}`);
    return { repo: fullName, status: "error", detail: err.message };
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
    const conflicts = results.filter((r) => r.status === "conflict").length;
    const errors = results.filter((r) => r.status === "error").length;

    console.log(`Total Forks: ${results.length}`);
    console.log(`✅ Synced/Up-to-date: ${successful}`);
    if (conflicts > 0) console.log(`⚠️ Conflicts: ${conflicts}`);
    if (errors > 0) console.log(`❌ Errors: ${errors}`);
    console.log("==========================================");
  } catch (err) {
    console.error("Fatal error during sync process:", err);
    process.exit(1);
  }
}

main();
