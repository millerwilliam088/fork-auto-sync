<div align="center">

# ForkSync Hub

**GitHub Fork リポジトリのクラウド自動同期エンジン & インタラクティブ Web ダッシュボード**

<p align="center">
  <a href="README.md">English</a> · 
  <a href="README_zh.md">简体中文</a> · 
  <a href="README_zh_tw.md">繁體中文</a> · 
  <b>日本語</b>
</p>

<p align="center">
  <a href="https://github.com/waw666waw666/fork-auto-sync/actions/workflows/sync.yml"><img src="https://img.shields.io/github/actions/workflow/status/waw666waw666/fork-auto-sync/sync.yml?branch=main&style=for-the-badge&logo=githubactions&logoColor=white&label=%E8%87%AA%E5%8B%95%E5%90%8C%E6%9C%9F" alt="Actions ステータス" /></a>
  <a href="https://github.com/waw666waw666/fork-auto-sync/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-10b981?style=for-the-badge" alt="MIT ライセンス" /></a>
  <img src="https://img.shields.io/badge/%E3%82%A2%E3%83%BC%E3%82%AD%E3%83%86%E3%82%AF%E3%83%81%E3%83%A3-100%25_%E3%82%B5%E3%83%BC%E3%83%90%E3%83%BC%E3%83%AC%E3%82%B9-0ea5e9?style=for-the-badge&logo=github&logoColor=white" alt="100% サーバーレス" />
  <img src="https://img.shields.io/badge/%E3%83%97%E3%83%A9%E3%82%A4%E3%83%90%E3%82%B7%E3%83%BC-%E3%82%BC%E3%83%AD%E3%83%88%E3%83%A9%E3%82%B9%E3%83%88-8b5cf6?style=for-the-badge&logo=security&logoColor=white" alt="ゼロトラスト" />
  <img src="https://img.shields.io/badge/%E3%83%AD%E3%83%BC%E3%82%AB%E3%83%AB%E7%92%B0%E5%A2%83-%E9%99%90%E7%95%8C%E3%82%BC%E3%83%AD%E8%B2%A0%E8%8D%B7-emerald?style=for-the-badge" alt="ゼロローカル負荷" />
</p>

<p align="center">
  <b>すべての Fork リポジトリを上流（Upstream）と自動で同期。手動でのクリック作業から解放されます。</b><br />
  <i>100% サーバーレス設計。追加サーバー費用なし、ローカルマシンの負荷なし、第三者サーバーへのトークン漏洩リスクなし。</i>
</p>

<p align="center">
  <a href="#-クイックスタート-1分で設定完了">クイックスタート</a> •
  <a href="#-なぜ-forksync-hub-なのか">プロジェクト背景</a> •
  <a href="#-主な機能">主な機能</a> •
  <a href="#-アーキテクチャ">アーキテクチャ</a> •
  <a href="#-セキュリティとプライバシー設計">セキュリティ</a> •
  <a href="#-設定ガイド">設定ガイド</a> •
  <a href="#-よくある質問-faq">FAQ</a> •
  <a href="#-ライセンス">ライセンス</a>
</p>

---

</div>

> [!TIP]
> 🌐 **公式 Web ダッシュボードのデモ体験**: **[https://waw666waw666.github.io/fork-auto-sync/](https://waw666waw666.github.io/fork-auto-sync/)**  
> *100% ブラウザ完結のゼロトラストセキュリティ — アクセストークンはローカルストレージにのみ保存され、外部サーバーに送信されることは一切ありません。*

---

## 🎯 なぜ ForkSync Hub なのか？

GitHub で多数のオープンソースプロジェクトを Fork すると、上流（Upstream）の更新に追従するのが大変になります：
- **従来の課題**: リポジトリごとに `Sync fork` ボタンを手動で押し続ける必要があり、時間が奪われます。ローカル PC でスクリプトを常駐させると、電気代がかかり、Git ブランチが汚れるリスクもあります。
- **既存ツールの欠点**: 一般的な GitHub Actions スクリプトには**視覚的な管理画面がなく**、ブラックボックスで動作します。また、外部 SaaS サービスに PAT（パーソナルアクセストークン）を預けるのは重大なセキュリティリスクを伴います。

**ForkSync Hub はこれらを一挙に解決します**: **美しいダークテーマの Web ダッシュボード**と **GitHub Actions ネイティブ実行エンジン**を組み合わせました。サーバーを契約することなく、**1 クリックで Fork するだけ**で自分専用の自動同期コントロールパネルが手に入ります！

---

## ✨ 主な機能

- 🌐 **美麗なダークテーマ Web コンソール**: Obsidian Dark (`#0b0f19`) とエメラルドグリーンの洗練されたデザイン。すべての Fork、追跡ブランチ、リリースバージョン、同期ステータスを一目で確認可能。
- 🔒 **エンドツーエンドのゼロトラストセキュリティ**: トークンは**ブラウザのローカル環境にのみ保存**され、公式 GitHub REST API と直接通信します。中継サーバーは一切存在しません。
- ⚙️ **Web 画面からのリアルタイムスケジュール変更**: 同期頻度（2時間ごと / 6時間ごと / 1日2回 / 毎日 09:00 など）を Web から直接切り替え可能。GitHub API 経由で `.github/workflows/sync.yml` に即時反映されます。
- 📦 **上流リポジトリ削除の自動保護**: 上流リポジトリの生存状態を自動チェック。作者がリポジトリを削除した場合（HTTP 404）は「📦 上流削除済 · 恒久独立アーカイブ」として安全にロックし、エラーを防ぎます。
- ⚡ **デュアル同期システム**:
  - **ブラウザ即時同期**: カードの「今すぐ同期」をクリックして、単一リポジトリを瞬時に merge-upstream し、コンソールログをリアルタイム表示。
  - **クラウド一括同期**: ヘッダーから GitHub Actions 実行を一括トリガーし、ミリ秒単位で進捗を追跡。
- 🛑 **きめ細やかな除外ルール**: 独自に変更を加えているリポジトリはチェックボックスを外すだけで同期対象から即座に除外可能。

---

## 🚀 クイックスタート (1分で設定完了)

3 つのステップで誰でも簡単に自分の同期ステーションを構築できます：

### ステップ 1: 本リポジトリを Fork
画面右上の **Fork** ボタンをクリックし、ご自身の GitHub アカウントにリポジトリを複製します。

### ステップ 2: Actions シークレットの設定
1. GitHub の [Tokens (Classic) 設定ページ](https://github.com/settings/tokens) にアクセスします。
2. 次の権限を付与して新しいトークンを生成します：
   - `repo`（リポジトリの読み取りおよび書き込み）
   - `workflow`（ワークフローの更新および Actions の手動実行）
3. Fork したリポジトリの **Settings** → **Secrets and variables** → **Actions** に移動します。
4. **New repository secret** をクリック：
   - **Name**: `SYNC_TOKEN`
   - **Secret**: 先ほど生成したトークンを貼り付けます。

### ステップ 3: GitHub Pages の有効化
1. リポジトリの **Settings** → **Pages** に移動します。
2. **Build and deployment** の **Source** で **GitHub Actions** を選択します。
3. 自動ビルドが完了すると、専用ダッシュボード URL が発行されます：
   ```
   https://<あなたのユーザー名>.github.io/fork-auto-sync/
   ```
4. URL を開き、画面でトークンを入力してロックを解除すれば準備完了です！

---

## 📄 ライセンス

本プロジェクトは [MIT ライセンス](LICENSE) のもとで公開されています。自由に Fork、カスタマイズ、共有してください！
