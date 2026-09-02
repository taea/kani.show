// kani.show — 長屋の組み立て
(function () {
  "use strict";
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

  // 1. data-crab / data-icon をドット絵に差し替え
  $$("[data-crab]").forEach((el) => { el.outerHTML = PX.crab(el.dataset.crab); });
  $$("[data-icon]").forEach((el) => { el.outerHTML = PX.icon(el.dataset.icon); });

  // 2. ヒーローの長屋
  const ROOMS = [
    { name: "母屋", href: "#juunin", crab: "sawagani" },
    { name: "寄合", href: "#juunin", crab: "takaashi" },
    { name: "内省室", href: "#kara", crab: "kogani" },
    { name: "棚", href: "#madori", crab: null },
    { name: "文箱", href: "#madori", crab: null },
    { name: "出張所", href: "#juunin", crab: "asahi" },
  ];
  const scene = $("#scene");
  if (scene) {
    const n = PX.nagaya(ROOMS);
    const labels = ROOMS.map((r, i) => {
      const cx = (n.offset + i * n.roomWidth + n.roomWidth / 2) / n.width * 100;
      const cy = n.signY / n.height * 100;
      return `<a href="${r.href}" style="left:${cx.toFixed(2)}%;top:${cy.toFixed(2)}%;transform:translate(-50%,-50%)">${r.name}</a>`;
    }).join("");
    // 地面の上を横歩きするカニ達（reduced-motion なら止まる）
    const walkers = [
      { kind: "sawagani", dur: 46, delay: -8 },
      { kind: "kogani", dur: 30, delay: -20, cls: "mini" },
      { kind: "takaashi", dur: 60, delay: -35, cls: "tall" },
      { kind: "zuwai", dur: 52, delay: -2 },
      { kind: "asahi", dur: 40, delay: -28 },
      { kind: "hiroiya", dur: 70, delay: -50 },
    ].map((w) => `<div class="walker ${w.cls || ""}" style="--dur:${w.dur}s;--delay:${w.delay}s">${PX.crab(w.kind)}</div>`).join("");
    const groundPct = ((n.height - n.groundY) / n.height * 100).toFixed(2);
    const crabH = (8.5 / n.height * 100).toFixed(2);
    scene.innerHTML = `<div class="scene-inner">` + n.svg + `<div class="room-labels">${labels}</div>` +
      `<div class="hero-crabs" style="bottom:${groundPct}%;height:${crabH}%">${walkers}</div></div>`;
  }
  // 星
  const stars = $("#stars");
  if (stars) {
    let h = "";
    for (let i = 0; i < 40; i++) {
      const x = (i * 37 + 11) % 100, y = (i * 53 + 7) % 55;
      h += `<i style="left:${x}%;top:${y}%;animation-delay:${(i % 7) * 0.4}s"></i>`;
    }
    stars.innerHTML = h;
  }

  // 3. 一日の時刻表
  const sky = $("#clock-sky"), lane = $("#clock-lane"), marks = $("#clock-marks");
  if (sky && lane && marks) {
    let t = "";
    for (let hr = 0; hr <= 24; hr += 3) {
      t += `<div class="tick" style="left:${hr / 24 * 100}%"><i>${String(hr).padStart(2, "0")}</i></div>`;
    }
    lane.innerHTML = t;
    sky.innerHTML = `<div class="sun" style="left:${12.5 / 24 * 100}%"></div><div class="moon2" style="left:${1 / 24 * 100}%"></div>`;
    const M = [
      [2.1, PX.icon("kura")], [3.3, PX.crab("hiroiya")], [4.5, PX.icon("kaisou")],
      [12, PX.crab("kogani")], [13, PX.icon("asakan")], [14, PX.crab("asakan")], [20, PX.crab("kogani")],
    ];
    marks.innerHTML = M.map(([h, svg]) => `<div class="m" style="left:${h / 24 * 100}%">${svg}</div>`).join("");
  }

  // 4. 目次の現在地
  const links = $$(".noren nav a");
  const secs = links.map((a) => $(a.getAttribute("href"))).filter(Boolean);
  if ("IntersectionObserver" in window && secs.length) {
    const io = new IntersectionObserver((ents) => {
      ents.forEach((e) => {
        if (!e.isIntersecting) return;
        links.forEach((a) => a.removeAttribute("aria-current"));
        const a = links.find((l) => l.getAttribute("href") === "#" + e.target.id);
        if (a) a.setAttribute("aria-current", "true");
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    secs.forEach((s) => io.observe(s));
  }
})();
