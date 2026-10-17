# Fork Auto Sync (全自动 Fork 仓库云端同步器)

> 🌐 **官方 Web 控制台在线地址**：**[https://waw666waw666.github.io/fork-auto-sync/](https://waw666waw666.github.io/fork-auto-sync/)**  
> （无需买服务器，直接在浏览器中查看全部 Fork 状态、版本、上次同步时间并一键唤醒云端同步）

全自动保持 GitHub 账号下所有 Fork 仓库与原作者（Upstream）同步的云端守护工具。

---

## 核心特性

- 🌐 **专属 Web 控制台**：一目了然查看所有 Fork 的版本、跟踪分支、上游作者及最近更新时间。
- ☁️ **完全云端运行**：基于 GitHub Actions，100% 运行于 GitHub 机房，不修改本地任何文件，保护本地代码零污染。
- ⏰ **定时自动巡检**：每天固定时间（北京时间 08:00 & 20:00）自动扫描账号下的全部 Fork 仓库并拉取最新提交。
- ⚡ **一键立即同步**：随时在 Web 控制台或 Actions 页面点击立即全量同步。
- 🛡️ **冲突安全保护**：若遇到上游代码冲突，自动安全保持原样，绝不搞乱仓库。
- ⚙️ **黑白名单支持**：在 `config.json` 中配置 `exclude`，可自由锁定某个 Fork 不随上游更新。

---

## 使用方式

### 1. 通过 Web 控制台（推荐）
直接访问 **[Web 控制台](https://waw666waw666.github.io/fork-auto-sync/)**：
- 查看每个 Fork 仓库的状态、代码版本、上次更新时间。
- 点击单个卡片上的 **「立即同步」**，或点击顶部 **「唤醒云端 Actions 立即同步」**。

### 2. 通过 GitHub Actions 原生界面
进入本仓库的 **[Actions 调度中心](https://github.com/waw666waw666/fork-auto-sync/actions)** -> 选择 **Auto Sync All Forks** -> 点击 **Run workflow** 执行。
