/*
 * Мини-библиотека графиков на чистом SVG — без внешних зависимостей,
 * поэтому сайт работает и без интернета, и на GitHub Pages.
 * barChart(container, opts)  — столбчатая (одна или несколько серий)
 * lineChart(container, opts) — линейная
 */
(function () {
  const NS = "http://www.w3.org/2000/svg";
  let W = 640, H = 290;
  const M = { t: 16, r: 12, b: 48, l: 44 };
  function size(container) {
    W = Math.max(280, Math.round(container.clientWidth || 640));
    H = W < 480 ? 230 : 280;
  }
  // перенос подписи по словам, чтобы она уместилась в ширину столбца
  function wrapLabel(text, maxW) {
    let str = String(text);
    if (str.length * 7.2 > maxW) str = str.replace(/–/g, "– ");
    const words = str.split(" "), out = [];
    let cur = "";
    words.forEach(w => {
      const t = cur ? cur + " " + w : w;
      if (t.length * 7.2 > maxW && cur) { out.push(cur); cur = w; } else cur = t;
    });
    out.push(cur);
    return out;
  }

  function el(name, attrs, parent) {
    const n = document.createElementNS(NS, name);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }
  const fmt = v => v == null ? "—" : v.toLocaleString("ru-RU", { maximumFractionDigits: 2 });

  function niceMax(v) {
    const p = Math.pow(10, Math.floor(Math.log10(v)));
    const steps = [1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10];
    for (const s of steps) if (s * p >= v) return s * p;
    return 10 * p;
  }

  // на телефоне подсказка исчезает при прокрутке или касании вне графика
  if (!window.__tipGuard) {
    window.__tipGuard = true;
    const hideAll = () => document.querySelectorAll(".tip").forEach(t => t.style.opacity = 0);
    window.addEventListener("scroll", hideAll, { passive: true });
    document.addEventListener("pointerdown", e => { if (!e.target.closest(".chart")) hideAll(); });
  }
  function tooltip(wrap) {
    let t = wrap.querySelector(".tip");
    if (!t) { t = document.createElement("div"); t.className = "tip"; wrap.appendChild(t); }
    return {
      show(html, x, y) {
        t.innerHTML = html; t.style.opacity = 1;
        const r = wrap.getBoundingClientRect();
        let left = x - r.left + 12, top = y - r.top - 56;
        const tw = Math.min(220, r.width - 8);
        if (left + tw > r.width) left = Math.max(0, r.width - tw);
        t.style.left = left + "px"; t.style.top = top + "px";
      },
      hide() { t.style.opacity = 0; }
    };
  }

  function axes(svg, max, ticks, unit, min) {
    min = min || 0;
    const g = el("g", { class: "axis" }, svg);
    for (let i = 0; i <= ticks; i++) {
      const v = min + (max - min) * i / ticks;
      const y = M.t + (H - M.t - M.b) * (1 - i / ticks);
      el("line", { x1: M.l, x2: W - M.r, y1: y, y2: y, class: Math.abs(v) < 1e-9 ? "base" : "grid" }, g);
      const tx = el("text", { x: M.l - 8, y: y + 4, "text-anchor": "end" }, g);
      tx.textContent = fmt(v);
    }
  }

  function legend(wrap, series, colors) {
    if (series.length < 2) return;
    const lg = document.createElement("div");
    lg.className = "legend";
    series.forEach((s, i) => {
      const it = document.createElement("span");
      it.innerHTML = `<i style="background:${colors[i]}"></i>${s.name}`;
      lg.appendChild(it);
    });
    wrap.insertBefore(lg, wrap.firstChild);
  }

  function tableToggle(wrap, head, rows) {
    const btn = document.createElement("button");
    btn.className = "table-btn"; btn.type = "button";
    btn.textContent = "Показать таблицу";
    const tbl = document.createElement("table");
    tbl.className = "data-table"; tbl.hidden = true;
    tbl.innerHTML = "<thead><tr>" + head.map(h => `<th>${h}</th>`).join("") + "</tr></thead><tbody>" +
      rows.map(r => "<tr>" + r.map((c, i) => i ? `<td>${fmt(c)}</td>` : `<th scope="row">${c}</th>`).join("") + "</tr>").join("") + "</tbody>";
    btn.onclick = () => { tbl.hidden = !tbl.hidden; btn.textContent = tbl.hidden ? "Показать таблицу" : "Скрыть таблицу"; };
    wrap.appendChild(btn); wrap.appendChild(tbl);
  }

  function unitLabel(wrap, unit) {
    const u = document.createElement("div"); u.className = "unit-label"; u.textContent = unit;
    wrap.appendChild(u);
  }
  function onResize(container, draw) {
    let last = container.clientWidth, t;
    new ResizeObserver(() => {
      clearTimeout(t);
      t = setTimeout(() => { if (Math.abs(container.clientWidth - last) > 20) { last = container.clientWidth; draw(); } }, 120);
    }).observe(container);
  }

  window.barChart = function (container, o) {
    if (!container._resize) { container._resize = true; onResize(container, () => window.barChart(container, o)); }
    container.innerHTML = "";
    size(container);
    const wrap = document.createElement("div"); wrap.className = "chart";
    container.appendChild(wrap);
    const colors = o.colors || ["var(--s1)", "var(--s2)"];
    legend(wrap, o.series, colors);
    unitLabel(wrap, o.unit);
    // узкий экран и много категорий — подписи наклонно
    const rotate = (W - 56) / o.categories.length < 58 && o.categories.length > 6;
    M.b = rotate ? 70 : 48;
    if (rotate) H += 20;
    const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": o.title || "" }, wrap);
    const all = o.series.flatMap(s => s.values).filter(v => v != null);
    const max = o.max || niceMax(Math.max(...all) * 1.08);
    const lo = Math.min(0, ...all);
    const min = lo < 0 ? -(o.minStep || max / 4) * Math.ceil(-lo * 1.08 / (o.minStep || max / 4)) : 0;
    const ticks = lo < 0 ? Math.round((max - min) / (o.minStep || max / 4)) : 4;
    axes(svg, max, ticks, o.unit, min);
    const tip = tooltip(wrap);
    const n = o.categories.length, k = o.series.length;
    const band = (W - M.l - M.r) / n;
    const gap = 2, bw = Math.min(56, (band * 0.7 - gap * (k - 1)) / k);
    const plotH = H - M.t - M.b;
    o.categories.forEach((c, i) => {
      const x0 = M.l + band * i + (band - (bw * k + gap * (k - 1))) / 2;
      o.series.forEach((s, j) => {
        const v = s.values[i];
        if (v == null) return;
        const Y = val => M.t + plotH * (max - val) / (max - min);
        const x = x0 + j * (bw + gap), y0 = Y(0), y1 = Y(v), h = Math.abs(y0 - y1);
        const r = Math.min(4, bw / 2, h);
        // столбец со скруглённым концом (вверх для плюса, вниз для минуса)
        const d = v >= 0
          ? `M${x},${y0} V${y1 + r} Q${x},${y1} ${x + r},${y1} H${x + bw - r} Q${x + bw},${y1} ${x + bw},${y1 + r} V${y0} Z`
          : `M${x},${y0} V${y1 - r} Q${x},${y1} ${x + r},${y1} H${x + bw - r} Q${x + bw},${y1} ${x + bw},${y1 - r} V${y0} Z`;
        const fill = o.negColor && v < 0 ? o.negColor : colors[j];
        el("path", { d, fill, class: "bar" }, svg);
        if (o.labels !== false && k === 1 && band >= 34) {
          const t = el("text", { x: x + bw / 2, y: v >= 0 ? y1 - 6 : y1 + 15, "text-anchor": "middle", class: "val" }, svg);
          t.textContent = fmt(v);
        }
        const hit = el("rect", { x: x - gap, y: M.t, width: bw + gap * 2, height: plotH, class: "hit" }, svg);
        const showTip = e => tip.show(`<b>${c}</b><br>${s.name ? s.name + ": " : ""}${fmt(v)} ${o.unit}`, e.clientX, e.clientY);
        hit.addEventListener("pointermove", showTip);
        hit.addEventListener("pointerdown", showTip);
        hit.addEventListener("pointerleave", e => { if (e.pointerType === "mouse") tip.hide(); });
      });
      const cx = M.l + band * i + band / 2;
      if (rotate) {
        const ty = H - M.b + 14;
        const lbl = el("text", { x: cx, y: ty, "text-anchor": "end", class: "cat", transform: `rotate(-50 ${cx} ${ty})` }, svg);
        lbl.textContent = c;
      } else {
        const lbl = el("text", { x: cx, y: H - M.b + 18, "text-anchor": "middle", class: "cat" }, svg);
        wrapLabel(c, band - 6).forEach((ln, li) => {
          const ts = el("tspan", { x: cx, dy: li ? 15 : 0 }, lbl); ts.textContent = ln;
        });
      }
    });
    M.b = 48;
    if (o.table !== false) tableToggle(wrap, [o.catHead || "", ...o.series.map(s => s.name || o.unit)],
      o.categories.map((c, i) => [c, ...o.series.map(s => s.values[i])]));
  };

  window.lineChart = function (container, o) {
    if (!container._resize) { container._resize = true; onResize(container, () => window.lineChart(container, o)); }
    container.innerHTML = "";
    size(container);
    const wrap = document.createElement("div"); wrap.className = "chart";
    container.appendChild(wrap);
    unitLabel(wrap, o.unit);
    const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": o.title || "" }, wrap);
    const max = o.max || niceMax(Math.max(...o.values) * 1.08);
    axes(svg, max, 4, o.unit);
    const tip = tooltip(wrap);
    const plotH = H - M.t - M.b, plotW = W - M.l - M.r;
    // ось X пропорциональна годам
    const ys = o.years.map(Number), y0 = ys[0], y1 = ys[ys.length - 1];
    const X = yr => M.l + 20 + (plotW - 40) * (yr - y0) / (y1 - y0);
    const Y = v => M.t + plotH * (1 - v / max);
    const pts = o.values.map((v, i) => [X(ys[i]), Y(v)]);
    el("path", { d: "M" + pts.map(p => p.join(",")).join(" L"), class: "line", stroke: "var(--s1)" }, svg);
    const cross = el("line", { y1: M.t, y2: M.t + plotH, class: "cross", opacity: 0 }, svg);
    pts.forEach((p, i) => {
      el("circle", { cx: p[0], cy: p[1], r: 5, class: "dot" }, svg);
      const t = el("text", { x: p[0], y: H - M.b + 18, "text-anchor": "middle", class: "cat" }, svg);
      t.textContent = o.years[i];
      if (o.labels !== false) {
        const v = el("text", { x: p[0], y: p[1] - 12, "text-anchor": "middle", class: "val" }, svg);
        v.textContent = fmt(o.values[i]);
      }
    });
    const hit = el("rect", { x: M.l, y: M.t, width: plotW, height: plotH, class: "hit" }, svg);
    const lineTip = e => {
      const r = svg.getBoundingClientRect();
      const sx = (e.clientX - r.left) * W / r.width;
      let best = 0;
      pts.forEach((p, i) => { if (Math.abs(p[0] - sx) < Math.abs(pts[best][0] - sx)) best = i; });
      cross.setAttribute("x1", pts[best][0]); cross.setAttribute("x2", pts[best][0]); cross.setAttribute("opacity", 1);
      tip.show(`<b>${o.years[best]}</b><br>${fmt(o.values[best])} ${o.unit}`, e.clientX, e.clientY);
    };
    hit.addEventListener("pointermove", lineTip);
    hit.addEventListener("pointerdown", lineTip);
    hit.addEventListener("pointerleave", e => { if (e.pointerType === "mouse") { tip.hide(); cross.setAttribute("opacity", 0); } });
    tableToggle(wrap, ["Год", o.unit], o.years.map((y, i) => [y, o.values[i]]));
  };
})();
