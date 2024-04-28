# Gomastro

このテーマは[Fuwari](https://github.com/saicaca/fuwari)をベースに作っています．  
フレームワークには[Astro](https://astro.build)を使用．

[ブログはこちら](https://blog.gomatamago.net/)

## 使い方

1. テンプレートから[新しいリポジトリを作成](https://github.com/gomagom/gomastro/generate) するか，このリポジトリをフォーク.
2. ブログをローカルで編集するには，リポジトリをクローンした後，`pnpm install` と `pnpm add sharp` を実行して依存関係をインストールします．  
   - [pnpm](https://pnpm.io)がインストールされていない場合は `npm install -g pnpm` で導入可能です．
3. `src/config.ts`ファイルを編集する事でブログを自分好みにカスタマイズ出来ます．
   - このリポジトリはすでに[私のブログ](blog.gomatamago.net)用にカスタマイズされているため，注意してください．
4. 新しい記事は`strapi`経由で公開できます．
   - `src/.env`を作成し，以下の環境変数を入力
      ```Properties
      STRAPI_AVATAR="アバターのURL"
      STRAPI_URL="https://[strapiのドメイン]"
      STRAPI_DOMAIN="[strapiのドメイン]"
      STRAPI_TOKEN="[API用に発行したトークン]"
      ```
5. 作成したブログをVercel，Netlify，GitHub Pagesなどにデプロイするには[ガイド](https://docs.astro.build/ja/guides/deploy/)に従って下さい．加えて，別途デプロイを行う前に`astro.config.mjs`を編集してサイト構成を変更する必要があります．

## コマンド

すべてのコマンドは，ターミナルでプロジェクトのルートから実行する必要があります:

| Command                             | Action                                           |
|:------------------------------------|:-------------------------------------------------|
| `pnpm install` AND `pnpm add sharp` | 依存関係のインストール                           |
| `pnpm dev`                          | `localhost:4321`で開発用ローカルサーバーを起動      |
| `pnpm build`                        | `./dist/`にビルド内容を出力          |
| `pnpm preview`                      | デプロイ前の内容をローカルでプレビュー     |
| `pnpm new-post <filename>`          | 新しい投稿を作成                                |
| `pnpm astro ...`                    | `astro add`, `astro check`の様なコマンドを実行する際に使用 |
| `pnpm astro --help`                 | Astro CLIのヘルプを表示                     |
