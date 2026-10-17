<div align="center">

# ForkSync Hub

**全自動 GitHub Fork 專案雲端同步器 · 現代化互動式 Web 控制台**

<p align="center">
  <a href="README.md">English</a> · 
  <a href="README_zh.md">简体中文</a> · 
  <b>繁體中文</b> · 
  <a href="README_ja.md">日本語</a>
</p>

<p align="center">
  <a href="https://github.com/waw666waw666/fork-auto-sync/actions/workflows/sync.yml"><img src="https://img.shields.io/github/actions/workflow/status/waw666waw666/fork-auto-sync/sync.yml?branch=main&style=for-the-badge&logo=githubactions&logoColor=white&label=%E9%9B%B2%E7%AB%AF%E5%90%8C%E6%AD%A5" alt="Actions 狀態" /></a>
  <a href="https://github.com/waw666waw666/fork-auto-sync/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-10b981?style=for-the-badge" alt="MIT 開源協議" /></a>
  <img src="https://img.shields.io/badge/%E6%9E%B6%E6%A7%8B-100%25_%E7%84%A1%E4%BC%BA%E6%9C%8D%E5%99%A8-0ea5e9?style=for-the-badge&logo=github&logoColor=white" alt="100% 無伺服器" />
  <img src="https://img.shields.io/badge/%E9%9A%B1%E7%A7%81-%E7%AB%AF%E5%88%B0%E7%AB%AF%E9%9B%B6%E4%BF%A1%E4%BB%BB-8b5cf6?style=for-the-badge&logo=security&logoColor=white" alt="端到端零信任" />
  <img src="https://img.shields.io/badge/%E6%9C%AC%E5%9C%B0%E7%A3%81%E7%A2%9F-%E9%9B%B6%E6%B1%A1%E6%9F%93-emerald?style=for-the-badge" alt="本地零污染" />
</p>

<p align="center">
  <b>讓你的所有 Fork 專案與上游原作者永遠保持最新，再也不用手動點擊 Sync Fork。</b><br />
  <i>100% 無伺服器架構，無須購買任何雲端主機，本地電腦零負載，無第三方資料中轉外洩風險。</i>
</p>

<p align="center">
  <a href="#-1-分鐘快速上手指南">快速上手</a> •
  <a href="#-為什麼需要-forksync-hub">專案背景</a> •
  <a href="#-核心特性">核心特性</a> •
  <a href="#-系統架構">系統架構</a> •
  <a href="#-安全與隱私防護設計">安全與隱私</a> •
  <a href="#-設定說明">設定說明</a> •
  <a href="#-常見問題-faq">常見問題</a> •
  <a href="#-開源協議">開源協議</a>
</p>

---

</div>

> [!TIP]
> 🌐 **官方 Web 控制台線上體驗**：**[https://waw666waw666.github.io/fork-auto-sync/](https://waw666waw666.github.io/fork-auto-sync/)**  
> *100% 瀏覽器本地零信任安全 — 你的個人憑證（Token）嚴格保存在目前瀏覽器本地，絕不經過任何第三方伺服器中轉。*

---

## 🎯 為什麼需要 ForkSync Hub？

在 GitHub 上 Fork 了大量開源專案後，原作者（Upstream）一旦更新程式碼，你的 Fork 儲存庫就會逐漸落後：
- **傳統方式痛點**：必須定期逐一打開每個儲存庫的首頁手動點擊 `Sync fork`，費時費力；或者在本地電腦常駐排程腳本，既耗電又容易弄亂本地 Git 分支。
- **現有工具局限**：市面上的 Action 腳本通常**沒有任何視覺化介面**，黑箱執行，無法直觀掌握狀態與版本標籤；而第三方同步 SaaS 則需要將個人核心 Token 上傳給不知名的外部平台，存在重大資安風險。

**ForkSync Hub 徹底解決了這一切**：將**現代化黑曜石深色 Web 互動面板**與 **GitHub Actions 官方容器執行引擎**完美融合。你不需要購買任何伺服器，只要 **1 鍵 Fork** 本專案，即可免費擁有專屬於你的自動化同步控制台！

---

## ✨ 核心特性

- 🌐 **沉浸式深色 Web 控制台**：採用 Obsidian Dark (`#0b0f19`) 與 Emerald Green 極簡工程美學。集中監控所有 Fork 儲存庫的追蹤分支、程式碼版本（Release Tag）、上游作者與同步狀態。
- 🔒 **端到端純前端零信任安全**：存取憑證（PAT）**僅保存在目前瀏覽器本地儲存**中，直接透過 HTTPS 與 GitHub 官方 REST API 握手通訊。絕無任何第三方中轉，100% 開源透明。
- ⚙️ **Web 端即時排程控制**：在網頁上即可一鍵切換雲端同步週期（每 2 小時 / 每 6 小时 / 每日 2 次 / 每日 09:00），直接透過 GitHub API 寫回 `.github/workflows/sync.yml` 與 `config.json`，免去終端機操作。
- 📦 **智慧上游刪庫防護**：自動向上游探測存活狀態。若母專案已被原作者刪除（HTTP 404），系統自動標記為「📦 上游已刪 · 絕版鏡像」並安全鎖定，避免破壞性 409 誤報。
- ⚡ **雙軌同步機制**：
  - **網頁秒級直調**：在單卡片上點擊「立即同步」，瀏覽器直連 GitHub API 完成單庫 upstream 合併並即時輸出執行終端紀錄。
  - **雲端全量排程**：點擊頂部「立即同步全部 Fork」，一鍵喚醒雲端容器批次執行，帶毫秒級輪詢與耗時統計。
- 🛑 **細粒度黑白名單規則**：支援隨時在設定中勾選或排除特定儲存庫，需要保留定製修改的專案可一鍵鎖定，永不被上游沖刷。

---

## 🚀 1 分鐘快速上手指南

任何人只需三步，耗時不到 1 分鐘即可部署好自己的專屬同步平台：

### 第一步：Fork 本專案
點擊本頁面右上角的 **Fork** 按鈕，將本儲存庫複製到你的 GitHub 個人帳號下。

### 第二步：設定 GitHub Actions 密鑰
1. 造訪 GitHub [Tokens 設定頁面 (Classic)](https://github.com/settings/tokens)。
2. 產生一個新 Token，勾選以下權限：
   - `repo`（完整讀寫儲存庫程式碼）
   - `workflow`（允許更新工作流程設定與排程 Actions）
3. 進入你 Fork 出來的儲存庫首頁，點擊 **Settings** → **Secrets and variables** → **Actions**。
4. 點擊 **New repository secret**：
   - **Name**: `SYNC_TOKEN`
   - **Secret**: 貼上剛才產生的 Personal Access Token。

### 第三步：開啟 GitHub Pages 專屬網頁
1. 進入儲存庫 **Settings** → **Pages**。
2. 在 **Build and deployment** 下的 **Source** 中，選擇 **GitHub Actions**。
3. 內建流水線將自動編譯並發布你的專屬控制台：
   ```
   https://<你的使用者名稱>.github.io/fork-auto-sync/
   ```
4. 打開該連結，在私密鎖定畫面中輸入你的 Token 解鎖，即可開始管理你的所有 Fork 儲存庫！

---

## 📄 開源協議

本專案採用 [MIT 授權條款](LICENSE) 開源。歡迎自由 Fork、定製與二次分發！
