# web-wg-app

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Type-Check, Compile and Minify for Production

```sh
pnpm build
```

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm lint
```

## Firebase 設定

1. Firebase プロジェクトを作成
2. Firestore Database を有効化
3. `.env.example` をコピーして `.env` ファイルを作成
4. Firebase 設定値を `.env` ファイルに入力

```sh
cp .env.example .env
# .env ファイルを編集してFirebase設定を追加
```

## GitHub Pages デプロイ

1. GitHub リポジトリの Settings > Pages で Source を "GitHub Actions" に設定
2. Repository secrets に Firebase 設定値を追加:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

---

## 要件仕様

以下の要件を満たすアプリを作成してほしい

## アプリ名

WebWG Page

## 概要

Web WG(WorkingGroup)でグループワークとして勉強した内容・スケジュールをメモできるアプリ

## システム要件

- 使用する主要ライブラリは以下
  - tue@latest
  - typeScript
  - pinia
  - vue-router
  - tailwindcss
- Firebase CloudFireStore に入力データをすべて保存
- GithubPagesでホスティング

## 機能要件

- サイドナビで各セクションが選択・追加・編集できる
- 各セクションの中身は以下
  - コンテンツセクション
    - タイトル入力
    - 担当者入力
    - モチベーション入力
    - やること詳細入力
    - 担当割
    - メモ（マークダウン形式）
  - 振り返りセクション
    - 星5段階評価をボタンで選択する
    - よかった点・改善点の入力
    - メンバーが入力した5段階評価とよかった点・改善点を図表でまとめる
    - メモ（マークダウン形式）
- カレンダー画面
  - カレンダーの表示
  - 予定をメモ入力・編集可能
