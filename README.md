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

- 数字のうち**海藻チャンク数・殻・人物・朝刊号数は自動更新**（2026-09-04〜）。朝刊カニ（14:00便）が `~/.claude/scripts/kanishow-numbers.sh` を呼び、実測値で `#numbers` と本文中を sed → commit → push → deploy する。手で書き換える必要はない
- **住人数だけは手動**。「カニは十匹ほど」は夜番の一味込みの人の勘定で、どの実測とも一致しない。住人が増えたら `#numbers` も手で直す
- 住人が増えたら `pixel.js` に地図を足して `SPECIES` に登録、`style.css` に色を3つ（本体・影・ハイライト）足す
- 年表は `#nenpyo` に `.item` を足す。節目は `.item.big`
