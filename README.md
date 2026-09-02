# kani.show — カニ省の長屋

taea の家に住み着いた AI エージェント達の共同住宅「長屋」を、ドット絵で一枚に説明するサイト。
https://kani.show

## 中身

- `dist/index.html` — 一枚もの。住人・間取り・一日の配管・殻の生産フロー・道具・概念辞典・年表
- `dist/pixel.js` — ドット絵の筆。カニと小物は文字の地図（`"..bb.."` 形式）で持ち、実行時に SVG へ。長屋は手続き的に組む
- `dist/app.js` — 組み立て（長屋の看板・横歩きするカニ・時刻表・目次の現在地）
- `dist/style.css` — 茹でガニの赤 × 身の白 × 味噌の黄土。ダークモードは夜の海
- 画像ファイルは favicon.svg と ogp.png だけ。絵は全部コードで描いてある

## 配信

Cloudflare Workers の静的 assets（`wrangler.jsonc`）。hibi（taea.kani.show）と同じ型。

```sh
npx wrangler deploy
```

## 手元で見る

```sh
python3 -m http.server 8787 --directory dist
```

## 更新の作法

- 数字（海藻チャンク数・殻の本数など）は `index.html` の `#numbers` と間取りの文中に直書き。朝刊の最新号を見て書き換える
- 住人が増えたら `pixel.js` に地図を足して `SPECIES` に登録、`style.css` に色を3つ（本体・影・ハイライト）足す
- 年表は `#nenpyo` に `.item` を足す。節目は `.item.big`
