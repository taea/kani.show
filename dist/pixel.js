// kani.show — ドット絵の筆（依存なし・実行時に SVG を組む）
// 絵は文字の地図で持つ。'.' は透明、それ以外は palette のキー。
(function () {
  "use strict";

  // 行ごとに同色の連続を1つの rect にまとめる（DOM を軽くする）
  function svgFromMap(map, palette, opts) {
    opts = opts || {};
    const h = map.length;
    const w = Math.max.apply(null, map.map((r) => r.length));
    let out = "";
    for (let y = 0; y < h; y++) {
      const row = map[y];
      let x = 0;
      while (x < w) {
        const c = row[x] || ".";
        if (c === ".") { x++; continue; }
        let x2 = x + 1;
        while (x2 < w && row[x2] === c) x2++;
        const fill = palette[c] || "magenta";
        out += `<rect x="${x}" y="${y}" width="${x2 - x}" height="1" fill="${fill}"/>`;
        x = x2;
      }
    }
    const cls = opts.className ? ` class="${opts.className}"` : "";
    const label = opts.label ? ` role="img" aria-label="${opts.label}"` : ` aria-hidden="true"`;
    return `<svg${cls}${label} viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMax meet">${out}</svg>`;
  }

  // ---- カニの地図 --------------------------------------------------------
  // b=甲羅 d=影・脚・目 h=ハイライト
  const CRAB = [
    "....d......d....",
    "....b......b....",
    ".bb..bbbbbb..bb.",
    "bbb.bbhhbbbb.bbb",
    "bb..bbhbbbbb..bb",
    ".b.bbbbbbbbbb.b.",
    "...bbbbbbbbbb...",
    "..d.d.bbbb.d.d..",
    ".d..d......d..d.",
    "d...d......d...d",
  ];

  // 子ガニ（ちいさい）
  const KOGANI = [
    "..d....d..",
    "..b....b..",
    "bb.bbbb.bb",
    "b.bbhbbb.b",
    "..bbbbbb..",
    ".d.d..d.d.",
    "d..d..d..d",
  ];

  // タカアシガニ（脚が長い。顧問）
  const TAKAASHI = [
    "....d......d....",
    "....b......b....",
    ".bb..bbbbbb..bb.",
    "bbb.bbhhbbbb.bbb",
    "bb..bbhbbbbb..bb",
    ".b.bbbbbbbbbb.b.",
    "...bbbbbbbbbb...",
    "..d.d.bbbb.d.d..",
    ".d..d......d..d.",
    "d...d......d...d",
    "d...d......d...d",
    "d...d......d...d",
    "d...d......d...d",
  ];

  // ズワイガニ（トゲトゲ。検分官）
  const ZUWAI = [
    "....d......d....",
    "..d.b.d..d.b.d..",
    ".bb.dbbbbbbd.bb.",
    "bbb.bbhhbbbb.bbb",
    "bb..bbhbbbbb..bb",
    ".b.bbbbbbbbbb.b.",
    "...bbbbbbbbbb...",
    "..d.d.bbbb.d.d..",
    ".d..d......d..d.",
    "d...d......d...d",
  ];

  // アサヒガニ（丸くて陽の色。出稼ぎ）
  const ASAHI = [
    "....d......d....",
    "....b......b....",
    ".bb.bbbbbbbb.bb.",
    "bbb.bhhbbbbb.bbb",
    "bb.bbhbbbbbbb.bb",
    ".b.bbbbbbbbbb.b.",
    "...bbbbbbbbbb...",
    "..d.d.bbbb.d.d..",
    ".d..d......d..d.",
    "d...d......d...d",
  ];

  // 朝刊カニ（新聞を掲げてる）: w=紙 k=文字
  const ASAKAN = [
    "kkkkkk.d......d.",
    "kwwwwk.b......b.",
    "kwkkwk..bbbbbb..",
    "kwwkwk.bbhhbbbbb",
    "kkkkkkbbbhbbbbbb",
    ".b.bbbbbbbbbbb.b",
    "...bbbbbbbbbb...",
    "..d.d.bbbb.d.d..",
    ".d..d......d..d.",
    "d...d......d...d",
  ];

  // 拾い屋（籠を背負ってる）: m=籠
  const HIROIYA = [
    "....d......d.mmm",
    "....b......b.mdm",
    ".bb..bbbbbb.mmmm",
    "bbb.bbhhbbbbmmmm",
    "bb..bbhbbbbbmmmm",
    ".b.bbbbbbbbbb.b.",
    "...bbbbbbbbbb...",
    "..d.d.bbbb.d.d..",
    ".d..d......d..d.",
    "d...d......d...d",
  ];

  // ---- 小物 --------------------------------------------------------------
  const ICONS = {
    // 海藻
    kaisou: [
      "...g....g.",
      "..g.g..g..",
      "..g..g.g..",
      "...g.g.g..",
      "..g..gg...",
      "...g.g....",
      "...gg.g...",
      "....g.g...",
      "....g.....",
      "..ddddd...",
    ],
    // 文箱（郵便受け）
    fumibako: [
      "..........",
      ".rrrrrrrr.",
      ".rwwwwwwr.",
      ".rwddddwr.",
      ".rwwwwwwr.",
      ".rrrrrrrr.",
      "....dd....",
      "....dd....",
      "....dd....",
      "...dddd...",
    ],
    // 棚（本棚）
    tana: [
      "mmmmmmmmmm",
      "mrbgrbgrbm",
      "mrbgrbgrbm",
      "mmmmmmmmmm",
      "mgrbgrbgrm",
      "mgrbgrbgrm",
      "mmmmmmmmmm",
      "mbgrbgrbgm",
      "mbgrbgrbgm",
      "mmmmmmmmmm",
    ],
    // 蔵（白壁の土蔵）
    kura: [
      "....dd....",
      "..dddddd..",
      ".dddddddd.",
      "dwwwwwwwwd",
      "dwwwwwwwwd",
      "dwwwddwwwd",
      "dwwwddwwwd",
      "dwwwddwwwd",
      "dwwwddwwwd",
      "dddddddddd",
    ],
    // 殻（脱いだ甲羅）
    kara: [
      "..........",
      "..bbbbbb..",
      ".bbhhbbbb.",
      "bbbhbbbbbb",
      "bbbbbbbbbb",
      "bbbbbbbbbb",
      ".bbbbbbbb.",
      "..d.dd.d..",
      ".d......d.",
      "..........",
    ],
    // 縁側（湯呑み）
    engawa: [
      "..........",
      "..........",
      "...w..w...",
      "..w..w....",
      ".gggggggg.",
      ".ggggggggd",
      ".ggggggggd",
      ".gggggggg.",
      "..gggggg..",
      ".mmmmmmmm.",
    ],
    // 提灯
    chochin: [
      "...dd...",
      "..rrrr..",
      ".rrrrrr.",
      ".rdrrdr.",
      ".rrrrrr.",
      ".rdrrdr.",
      ".rrrrrr.",
      "..rrrr..",
      "...dd...",
      "...dd...",
    ],
    // 巻物（朝刊）
    asakan: [
      "kkkkkkkkkk",
      "kwwwwwwwwk",
      "kwkkkwwwwk",
      "kwkkkwkkwk",
      "kwwwwwwwwk",
      "kwkkkkkkwk",
      "kwwwwwwwwk",
      "kwkkkkkkwk",
      "kwwwwwwwwk",
      "kkkkkkkkkk",
    ],
    // 井戸（海藻の水源）
    ido: [
      "....dd....",
      "..dddddd..",
      ".d......d.",
      ".d.mmmm.d.",
      ".d.mggm.d.",
      "..mmggmm..",
      "..mmggmm..",
      "..mmmmmm..",
      "..mmmmmm..",
      ".mmmmmmmm.",
    ],
    // 蝶（Bluesky）
    butterfly: [
      "..........",
      ".s......s.",
      "ss.s..s.ss",
      "sss.ss.sss",
      "ssss..ssss",
      ".sss..sss.",
      "..ss..ss..",
      "..ss..ss..",
      "...s..s...",
      "..........",
    ],
    // 犬（ちくわ）
    inu: [
      "..........",
      ".mm....mm.",
      "mmmm..mmmm",
      "mmdwwwwdmm",
      ".mwwwwwwm.",
      "..wdwwdw..",
      "..wwwwww..",
      "..wwddww..",
      "...wwww...",
      "..........",
    ],
    // ⚡ 省エネ
    setsuden: [
      "......yy..",
      ".....yy...",
      "....yy....",
      "...yyyyy..",
      "....yyy...",
      ".....yy...",
      "....yy....",
      "...yy.....",
      "..y.......",
      "..........",
    ],
    // 鈴
    suzu: [
      "....dd....",
      "...dyyd...",
      "..dyyyyd..",
      "..dyyyyd..",
      ".dyyyyyyd.",
      ".dyyyyyyd.",
      "dyyyyyyyyd",
      "dddddddddd",
      "....dd....",
      "..........",
    ],
    // 湯気（縁側用ではなく汎用ダミー）
  };

  // ---- 色 ----------------------------------------------------------------
  // CSS 変数を使うと dark/light で追従できる
  const V = (name) => `var(--${name})`;
  const SPECIES = {
    sawagani:   { map: CRAB,     pal: { b: V("c-sawa"),   d: V("c-sawa-d"),   h: V("c-sawa-h") } },
    kogani:     { map: KOGANI,   pal: { b: V("c-ko"),     d: V("c-ko-d"),     h: V("c-ko-h") } },
    takaashi:   { map: TAKAASHI, pal: { b: V("c-taka"),   d: V("c-taka-d"),   h: V("c-taka-h") } },
    zuwai:      { map: ZUWAI,    pal: { b: V("c-zuwai"),  d: V("c-zuwai-d"),  h: V("c-zuwai-h") } },
    asahi:      { map: ASAHI,    pal: { b: V("c-asahi"),  d: V("c-asahi-d"),  h: V("c-asahi-h") } },
    asakan:     { map: ASAKAN,   pal: { b: V("c-sawa"),   d: V("c-sawa-d"),   h: V("c-sawa-h"), w: V("c-paper"), k: V("c-ink") } },
    hiroiya:    { map: HIROIYA,  pal: { b: V("c-ko"),     d: V("c-ko-d"),     h: V("c-ko-h"),   m: V("c-miso") } },
  };
  const ICON_PAL = {
    g: V("c-seaweed"), d: V("c-ink"), r: V("c-kani"), w: V("c-paper"), m: V("c-miso"),
    b: V("c-sawa"), h: V("c-sawa-h"), k: V("c-ink"), s: V("c-shio"), y: V("c-yellow"),
  };

  function crab(kind, label) {
    const s = SPECIES[kind] || SPECIES.sawagani;
    return svgFromMap(s.map, s.pal, { className: "px px-crab px-" + kind, label });
  }
  function icon(kind, label) {
    const m = ICONS[kind];
    if (!m) return "";
    return svgFromMap(m, ICON_PAL, { className: "px px-icon px-" + kind, label });
  }

  // ---- 長屋（手続き的に組む） ----------------------------------------------
  // rooms: [{name, crab}] 。1部屋 = 幅 34px。屋根 8 + 壁 22 + 地面 2
  function nagaya(rooms, opts) {
    opts = opts || {};
    const RW = 34, ROOF = 9, WALL = 22, GROUND = 3;
    const W = RW * rooms.length + 6, H = ROOF + WALL + GROUND + 8;
    const parts = [];
    const r = (x, y, w, h, fill, extra) =>
      parts.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"${extra || ""}/>`);

    const y0 = 8; // 空の余白
    // 大屋根: 瓦の段々
    for (let row = 0; row < ROOF; row++) {
      const inset = Math.max(0, 3 - row);
      const shade = row % 2 === 0 ? V("c-roof") : V("c-roof-d");
      r(inset, y0 + row, W - inset * 2, 1, shade);
      if (row % 2 === 1) {
        // 瓦の丸: 4px おきに明るい点
        for (let x = inset + 1 + (row % 4 === 1 ? 0 : 2); x < W - inset; x += 4) r(x, y0 + row, 1, 1, V("c-roof-h"));
      }
    }
    // 軒
    r(0, y0 + ROOF, W, 1, V("c-ink"));
    // 壁
    const wy = y0 + ROOF + 1;
    r(0, wy, W, WALL, V("c-wall"));
    // 板目
    for (let yy = wy + 2; yy < wy + WALL; yy += 4) r(0, yy, W, 1, V("c-wall-d"));
    // 各部屋
    rooms.forEach((room, i) => {
      const x = 3 + i * RW;
      // 柱
      r(x, wy, 2, WALL, V("c-pillar"));
      // 看板（軒下の板）
      r(x + 5, wy + 1, RW - 10, 5, V("c-ink"));
      r(x + 6, wy + 2, RW - 12, 3, V("c-sign"));
      // 戸: 障子（白）+ 桟
      const dx = x + 10, dy = wy + 8, dw = 14, dh = WALL - 8;
      r(dx, dy, dw, dh, V("c-shoji"));
      r(dx + dw / 2 - 1, dy, 1, dh, V("c-pillar"));
      for (let yy = dy + 3; yy < dy + dh; yy += 4) r(dx, yy, dw, 1, V("c-pillar"));
      r(dx - 1, dy, 1, dh, V("c-pillar"));
      r(dx + dw, dy, 1, dh, V("c-pillar"));
      // 暖簾（赤）: 戸の上に3枚
      for (let k = 0; k < 3; k++) r(dx + k * 5, dy - 1, 4, 5, k === 1 ? V("c-kani-deep") : V("c-kani"));
      r(dx - 1, dy - 2, dw + 2, 1, V("c-ink"));
      // 提灯: 右の柱のそば
      const lx = x + RW - 6, ly = wy + 7;
      r(lx + 1, ly, 1, 2, V("c-ink"));
      r(lx, ly + 2, 3, 6, V("c-chochin"));
      r(lx, ly + 4, 3, 1, V("c-kani-deep"));
      r(lx + 1, ly + 8, 1, 1, V("c-ink"));
      // 窓（格子）
      r(x + 4, wy + 9, 4, 5, V("c-window"));
      r(x + 5, wy + 9, 1, 5, V("c-pillar"));
      r(x + 4, wy + 11, 4, 1, V("c-pillar"));
    });
    // 右端の柱
    r(W - 3, wy, 2, WALL, V("c-pillar"));
    // 地面
    r(0, wy + WALL, W, GROUND, V("c-ground"));
    for (let x = 0; x < W; x += 5) r(x + (x % 2), wy + WALL, 1, 1, V("c-ground-h"));

    const label = opts.label || "カニ省の長屋";
    return {
      svg: `<svg class="px px-nagaya" role="img" aria-label="${label}" viewBox="0 0 ${W} ${H}" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMax meet">${parts.join("")}</svg>`,
      width: W, height: H, roomWidth: RW, offset: 3, groundY: wy + WALL, signY: wy + 3.5,
    };
  }

  window.PX = { svgFromMap, crab, icon, nagaya, SPECIES, ICONS };
})();
