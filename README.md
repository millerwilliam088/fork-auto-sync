# ForkSync · 全自动 Fork 仓库云端同步器

<p align="center">
  <img src="https://img.shields.io/badge/Architecture-100%25_Serverless-10b981?style=flat-square&logo=github" alt="Serverless" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" alt="License" />
  <img src="https://img.shields.io/badge/Local_Storage-Zero_Pollution-emerald?style=flat-square" alt="Zero Local Pollution" />
  <img src="https://img.shields.io/badge/GitHub_Actions-Automated_Sync-black?style=flat-square&logo=githubactions" alt="GitHub Actions" />
</p>

> 🌐 **官方 Web 控制台在线体验**：**[https://waw666waw666.github.io/fork-auto-sync/](https://waw666waw666.github.io/fork-auto-sync/)**  
> 💡 *无需购买任何云服务器，100% 运行于 GitHub 官方机房与 GitHub Pages。本地电脑零负担、代码零污染！*

---

## 🎯 为什么需要本项目？

在 GitHub 上 Fork 了大量优秀的开源项目后，原作者（Upstream）一旦更新，你的 Fork 分支就会逐渐落后（Behind）。
- **传统方式的痛点**：必须定期逐个打开每个仓库的 GitHub 网页点击 `Sync fork`，费时费力；或者在本地机器跑脚本，既要耗电开机，又容易产生 Git 脏分支与本地冲突。
- **现存工具的局限**：市面上的 Action 脚本通常**没有任何可视化界面**，黑盒运行，无法随时直观查看版本与更新记录；而第三方同步 SaaS 则需要将个人核心 Token 上传给不知名的外部服务器，存在重大安全隐患。

**ForkSync** 彻底解决了这一切：打造了一套**纯前端 Serverless 交互控制面 + GitHub Actions 官方容器执行引擎**，无需自己掏钱买服务器，只要 1 键 Fork 即可免费拥有专属的自动化同步控制台！

---

## ✨ 核心特性

- 🌐 **沉浸式 Web 控制面板**：采用深色工程极简设计（Obsidian Dark + Emerald Green），直观查看全部 Fork 仓库的跟踪分支、代码版本（Release Tag）、上游作者及最后同步时间。
- 🔒 **端到端纯前端零信任安全**：访问凭据（Personal Access Token）**仅保存在当前浏览器的本地存储**中，直接与 GitHub 官方 REST API 握手通讯。绝无任何第三方中转服务器，代码 100% 开源审计。
- ⚙️ **Web 端实时调度控制**：在网页端即可自由切换云端执行周期（极速每 2 小时 / 每 6 小时 / 每日 2 次 / 每日 09:00），直接通过 GitHub API 双向写回 `.github/workflows/sync.yml` 与 `config.json`，无需本地终端。
- 🛡️ **智能上游注销识别（独家特性）**：自动检测上游原项目是否已被原作者注销或删库（HTTP 404）。遇到已删母库时，自动标记为「📦 上游已删 · 绝版镜像」并安全锁定，避免误报 409 冲突。
- ⚡ **双轨同步机制**：
  - **网页直调**：在卡片上直接点击「立即同步」，浏览器端秒级直连 GitHub API 完成单库 upstream 合并并实时输出执行日志。
  - **云端全量**：点击顶部「立即同步全部 Fork」，一键唤醒 GitHub Actions 云端容器全量执行，支持毫秒级轮询与耗时统计。
- 🛑 **细粒度黑白名单**：支持在界面中随时勾选或排除特定仓库，不愿随上游改动的仓库可一键锁定。

---

## 🏗️ 架构原理解析

```
                ┌──────────────────────────────────────────────┐
                │        用户浏览器 (GitHub Pages 静态托管)       │
                │   - 本地安全凭证锁屏 (Token 仅留于本地)           │
                │   - 实时轮询 / 单库同步 / 调度频率一键修改       │
                └──────────────┬───────────────────────────────┘
                               │ HTTPS (GitHub REST API 直接握手)
                               ▼
                ┌──────────────────────────────────────────────┐
                │          GitHub 官方平台 (零第三方服务)         │
                ├──────────────────────┬───────────────────────┤
                │                      │                       │
                ▼                      ▼                       ▼
      ┌──────────────────┐   ┌──────────────────┐    ┌──────────────────┐
      │  GitHub Actions  │   │  Fork 仓库集群    │    │ 上游原始母项目   │
      │  (定时/按需调度) │   │ (自动 Fast-Forward│    │ (Upstream)       │
      │  ubuntu-latest   │   │  或智能冲突保护)  │    │ 最新提交检测     │
      └──────────────────┘   └──────────────────┘    └──────────────────┘
```

---

## 🚀 1 分钟一键部署你自己的控制台

本项目完全支持开箱即用，任何人只需三步即可搭建属于自己的全自动同步平台：

### 第一步：Fork 本项目
点击本页面右上角的 **Fork** 按钮，将本仓库复制到你的 GitHub 个人账号下。

### 第二步：配置 GitHub Actions 密钥
1. 访问 GitHub [Tokens 设置页面](https://github.com/settings/tokens)，生成一个 **Personal Access Token (Classic)**。
   - 勾选权限：`repo`（完整仓库读写）与 `workflow`（更新 Actions 定时周期与调度）。
2. 进入你 Fork 出来的仓库主页，点击 **Settings** -> **Secrets and variables** -> **Actions**。
3. 点击 **New repository secret**：
   - Name 填入：`SYNC_TOKEN`
   - Secret 填入：刚才生成的 GitHub Token。

### 第三步：开启 GitHub Pages 专属网页
1. 进入仓库 **Settings** -> **Pages**。
2. 在 **Build and deployment** 下的 **Source** 中，选择 **GitHub Actions**（本仓库已自带自动部署流水线）。
3. 稍等约 1 分钟，流水线运行完毕后，页面顶部就会生成你的专属域名：`https://<你的用户名>.github.io/fork-auto-sync/`。
4. 打开该链接，输入你的 Token 解锁，即可随心所欲管理并自动同步你名下的所有 Fork 仓库！

---

## 常见问题 (FAQ)

<details>
<summary><b>Q1: 遇到上游母项目与我的分支发生代码冲突怎么办？</b></summary>
系统内置严格的安全防御策略。当 GitHub API 检测到合并冲突（HTTP 409）时，Actions 与 Web 端均会自动保持现状，<b>绝不强行覆写破坏你的分支</b>，并在面板上清晰标注「冲突安全保护」，你可以随时在 GitHub 网页上进行可视化对比。
</details>

<details>
<summary><b>Q2: 为什么我的 Token 需要 workflow 权限？</b></summary>
GitHub 官方安全规则要求：修改 `.github/workflows/sync.yml`（例如在网页端切换定时周期）或调度 Actions 运行必须具备 `workflow` 作用域。此 Token 仅在你自己的浏览器与 GitHub 之间传输，请放心授权。
</details>

<details>
<summary><b>Q3: 上游作者删库了会怎样？</b></summary>
系统会自动向上游探测存活状态。一旦发现母库 404，控制面板会自动挂起同步，提示「上游已删 · 绝版镜像」，保护你账号里的唯一代码备份完好无损。
</details>

---

## 📄 开源协议

本项目采用 [MIT License](LICENSE) 许可协议，欢迎自由 Fork、定制与传播！
