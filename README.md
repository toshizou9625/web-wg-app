# web-wg-app

Vue 3 + TypeScript + Viteで構築された、ワーキンググループの活動管理アプリケーションです。

## 📋 概要

このアプリケーションは、ワーキンググループの活動を効率的に管理するためのツールです。学習内容の記録、振り返り、カレンダー機能を通じて、チームの活動を可視化し、継続的な改善をサポートします。

### 主な機能

- **ダッシュボード**: 活動の概要と統計情報の表示
- **セクション管理**: 学習コンテンツと振り返りの一元管理
  - コンテンツセクション: 学習内容、担当者、課題などの記録
  - 振り返りセクション: 評価、良かった点、改善点の記録
  - チームメンバー個別の振り返り機能
- **カレンダー**: 活動履歴の日付別管理
- **データの永続化**: Firebaseを使用したクラウドストレージ

## 🛠 技術スタック

### フロントエンド
- **Vue 3** (Composition API)
- **TypeScript** - 型安全な開発
- **Vite** (Rolldown) - 高速ビルドツール
- **Vue Router** - ルーティング管理
- **Pinia** - 状態管理
- **Tailwind CSS** - ユーティリティファーストCSS
- **Chart.js / vue-chartjs** - データ可視化

### バックエンド・データベース
- **Firebase** (Firestore) - リアルタイムデータベース

### ユーティリティ
- **VueUse** - Vue Composableライブラリ
- **date-fns** - 日付操作
- **marked** - Markdownパーサー

### 開発ツール
- **ESLint** + **Oxlint** - コード品質管理（二段階リント）
- **Prettier** - コードフォーマッター
- **vue-tsc** - Vue向けTypeScriptコンパイラ

## 📦 必要要件

- **Node.js**: `^20.19.0` または `>=22.12.0`
- **pnpm**: このプロジェクトはpnpmを使用します

## 🚀 セットアップ

### 1. 依存関係のインストール

```bash
pnpm install
```

### 2. Firebase設定

`src/firebase.ts`にFirebaseの設定を追加してください：

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 3. 開発サーバーの起動

```bash
pnpm dev
```

## 📝 利用可能なコマンド

```bash
# 開発サーバー起動（ホットリロード）
pnpm dev

# 本番用ビルド（型チェック + ビルド）
pnpm build

# 本番環境用ビルド
pnpm build:prod

# ビルドのプレビュー
pnpm preview

# 型チェックのみ実行
pnpm type-check

# リント（Oxlint + ESLint）
pnpm lint

# コードフォーマット
pnpm format
```

## 🏗 プロジェクト構造

```
src/
├── components/          # 再利用可能なコンポーネント
│   ├── SideNavigation.vue
│   ├── LoadingSpinner.vue
│   ├── LoadingButton.vue
│   └── StarRating.vue
├── views/              # ページコンポーネント
│   ├── DashboardView.vue
│   ├── SectionView.vue
│   └── CalendarView.vue
├── stores/             # Piniaストア
│   ├── sections.ts
│   └── calendar.ts
├── services/           # 外部サービス連携
│   └── firestore.ts
├── types/              # TypeScript型定義
│   └── index.ts
├── router/             # ルーティング設定
│   └── index.ts
├── firebase.ts         # Firebase設定
└── main.ts            # アプリケーションエントリーポイント
```

## 🎨 コーディング規約

### リント
このプロジェクトは二段階リントを採用しています：

1. **Oxlint**: 正確性チェック（高速）
2. **ESLint**: Vue/TypeScript固有のルールチェック

### フォーマット
Prettierを使用してコードをフォーマットします。Oxcプラグインにより高速化されています。

### TypeScript
- 厳格な型チェックを有効化
- Composite projectセットアップ
- Vue SFCの型サポート（vue-tsc）

## 🔗 推奨IDE設定

- [Visual Studio Code](https://code.visualstudio.com/)
- [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) 拡張機能（Veturは無効化してください）

### .vueファイルの型サポート

TypeScriptはデフォルトで`.vue`のインポートの型情報を処理できないため、型チェックには`tsc`の代わりに`vue-tsc`を使用します。エディタでは、TypeScript言語サービスが`.vue`の型を認識できるように[Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)が必要です。

## 📖 機能詳細

### セクション管理
- **コンテンツセクション**: 学習内容、担当者、動機、詳細、課題、メモを記録
- **振り返りセクション**: 5段階評価、良かった点、改善点、メモを記録
- **チームメンバー振り返り**: メンバー個別の評価と振り返りを追加可能

### カレンダー機能
- 日付ごとの活動記録
- イベントの作成・編集・削除
- 活動履歴の可視化

### ダッシュボード
- セクション一覧の表示
- 統計情報の可視化（Chart.js使用）
- クイックアクセス機能

## 🔧 設定のカスタマイズ

Viteの設定については[Vite Configuration Reference](https://vite.dev/config/)を参照してください。

## 📄 ライセンス

プライベートプロジェクト

## 🤝 コントリビューション

このプロジェクトはプライベートリポジトリです。
