# Fork Auto Sync (全自动 Fork 仓库云端同步器)

全自动保持 GitHub 账号下所有 Fork 仓库与原作者（Upstream）同步的云端守护工具。

## 功能特性

- ☁️ **完全云端运行**：基于 GitHub Actions，不消耗本地计算机任何算力或带宽。
- ⏰ **定时自动巡检**：每天固定时间自动扫描账号下的全部 Fork 仓库并拉取最新提交。
- ⚡ **一键立即同步**：随时进入 Actions 页面点击 `Run workflow` 即可立刻全量同步。
- 🛡️ **安全隔离**：私有仓库存储，不向任何第三方服务泄露 Token。

## 使用方法

### 1. 手动立即同步
进入本仓库的 **Actions** 选项卡 -> 选择 **Auto Sync All Forks** -> 点击 **Run workflow** -> 点击绿色按钮执行。

### 2. 定时自动同步
GitHub Actions 会根据 `.github/workflows/sync.yml` 中配置的 cron 表达式自动定时执行，无需人工干预。
