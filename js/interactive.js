/* Интерактивные элементы в разделах с данными: ползунки и кнопки */
document.addEventListener("DOMContentLoaded", () => {
  const D = window.DATA;
  const f = (v, d = 1) => v.toLocaleString("ru-RU", { maximumFractionDigits: d });

  /* 1. «Угадайте факт»: сталь в 1932 г. */
  const g = document.getElementById("guess-steel");
  if (g) {
    const plan = D.plan.series[0].values[1], fact = D.plan.series[1].values[1];
    g.innerHTML = `
      <span class="w-tag">Проверьте интуицию</span>
      <h3>План первой пятилетки по стали — ${f(plan)} млн т. Сколько выплавили на самом деле в 1932 г.?</h3>
      <div class="slider-row big">
        <button type="button" class="step" data-d="-1" aria-label="Меньше">−</button>
        <input type="range" min="0" max="15" step="0.1" value="7.5" aria-label="Ваша оценка, млн т">
        <button type="button" class="step" data-d="1" aria-label="Больше">+</button>
        <output class="slider-val">7,5</output><span class="slider-suf">млн т</span>
      </div>
      <button type="button" class="act">Проверить</button>
      <p class="w-out" aria-live="polite"></p>`;
    const inp = g.querySelector("input"), out = g.querySelector("output"), res = g.querySelector(".w-out");
    const upd = () => { out.textContent = f(+inp.value); inp.style.setProperty("--p", (inp.value / 15 * 100) + "%"); };
    inp.addEventListener("input", upd);
    g.querySelectorAll(".step").forEach(b => b.addEventListener("click", () => { inp.value = Math.min(15, Math.max(0, +inp.value + 0.1 * b.dataset.d)).toFixed(1); upd(); }));
    g.querySelector(".act").addEventListener("click", () => {
      const v = +inp.value, diff = Math.abs(v - fact);
      res.innerHTML = `Факт: <b>${f(fact)} млн т</b>. Ваша оценка: ${f(v)} млн т — ` +
        (diff <= 0.5 ? "почти точно!" : diff <= 2 ? "близко." : v > fact ? "вы переоценили результат: план был далёк от выполнения." : "вы недооценили рост.") +
        ` Подробности — на графике ниже.`;
      upd();
    });
    upd();
  }

  /* 2. Кнопки по видам скота */
  const pick = document.getElementById("livestock-pick");
  if (pick) {
    const L = D.livestock;
    pick.innerHTML = `<div class="switch" role="group" aria-label="Вид скота">` +
      L.categories.map((c, i) => `<button type="button" data-i="${i}" aria-pressed="${i ? "false" : "true"}">${c}</button>`).join("") +
      `</div><div class="pick-out" aria-live="polite"></div>`;
    const out = pick.querySelector(".pick-out");
    const show = i => {
      const a = L.series[0].values[i], b = L.series[1].values[i];
      out.innerHTML = `<span class="pk-n">${f(a)}</span><span class="pk-arrow">→</span><span class="pk-n red">${f(b)}</span><span class="pk-u">млн голов (${L.series[0].name} → ${L.series[1].name})<br>меньше на ${f(a - b)} млн голов</span>`;
    };
    pick.querySelectorAll("button").forEach(b => b.addEventListener("click", () => {
      pick.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", "false"));
      b.setAttribute("aria-pressed", "true"); show(+b.dataset.i);
    }));
    show(0);
  }

  /* 3. Ползунок по переписям: город и деревня */
  const u = document.getElementById("urban-slider");
  if (u) {
    const Y = D.urban.years, V = D.urban.values;
    const lit = {}; D.literacy.years.forEach((y, i) => lit[y] = D.literacy.values[i]);
    u.innerHTML = `
      <span class="w-tag">Ползунок по переписям</span>
      <h3>Как менялась страна: город и деревня</h3>
      <input type="range" min="0" max="${Y.length - 1}" step="1" value="0" class="years" aria-label="Год переписи" list="urban-ticks">
      <div class="ticks">${Y.map(y => `<span>${y}</span>`).join("")}</div>
      <div class="u-out">
        <div class="u-year"></div>
        <div class="u-bar"><div class="u-city"></div><div class="u-village"></div></div>
        <div class="u-legend"><span class="u-c"></span><span class="u-v"></span></div>
        <p class="u-lit"></p>
      </div>`;
    const r = u.querySelector("input");
    const upd = () => {
      const i = +r.value, y = Y[i], c = V[i];
      r.style.setProperty("--p", (i / (Y.length - 1) * 100) + "%");
      u.querySelector(".u-year").textContent = y;
      u.querySelector(".u-city").style.width = c + "%";
      u.querySelector(".u-village").style.width = (100 - c) + "%";
      u.querySelector(".u-c").textContent = `Город — ${c} %`;
      u.querySelector(".u-v").textContent = `Деревня — ${100 - c} %`;
      u.querySelector(".u-lit").textContent = lit[y] ? `Грамотность населения 9–49 лет по этой переписи: ${f(lit[y])} %` : "";
    };
    r.addEventListener("input", upd); upd();
  }
});
