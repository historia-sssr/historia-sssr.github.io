/* Отрисовка графиков, плиток и теста на основе window.DATA */
document.addEventListener("DOMContentLoaded", () => {
  const D = window.DATA;
  const $ = s => document.querySelector(s);

  /* Источник под графиком */
  function src(sel, text, note) {
    const box = $(sel);
    if (!box) return;
    box.innerHTML = (note ? `<p class="note">${note}</p>` : "") + `<p class="src"><b>Источник:</b> ${text}</p>`;
  }

  /* 0. Темпы роста по периодам */
  barChart($("#chart-periods"), {
    title: "Темпы роста ВВП на душу населения", categories: D.periods.categories, unit: D.periods.unit,
    catHead: "Период", series: [{ name: "Темп роста, % в год", values: D.periods.values }],
    max: 15, minStep: 5, negColor: "var(--red)"
  });
  src("#src-periods", D.periods.source, D.periods.note);

  /* 1. Индустриализация — переключатель показателя */
  const ind = D.industry;
  function drawIndustry(key) {
    const m = ind.metrics[key];
    const cats = [], vals = [];
    ind.years.forEach((y, i) => { if (m.values[i] != null) { cats.push(y); vals.push(m.values[i]); } });
    barChart($("#chart-industry"), {
      title: m.label, categories: cats, unit: m.unit, catHead: "Год",
      series: [{ name: m.label, values: vals }]
    });
    const first = vals[cats.indexOf("1928")], last = vals[vals.length - 1];
    $("#industry-ratio").textContent = `${m.label}: рост за 1928–1940 гг. — в ${(last / first).toLocaleString("ru-RU", { maximumFractionDigits: 1 })} раза`;
  }
  document.querySelectorAll("#metric-switch button").forEach(b => {
    b.addEventListener("click", () => {
      document.querySelectorAll("#metric-switch button").forEach(x => x.setAttribute("aria-pressed", "false"));
      b.setAttribute("aria-pressed", "true");
      drawIndustry(b.dataset.key);
    });
  });
  drawIndustry("steel");
  src("#src-industry", ind.source, ind.note);

  /* 2. План и факт */
  barChart($("#chart-plan"), {
    title: "План и факт", categories: D.plan.categories, unit: D.plan.unit, catHead: "Продукция",
    series: D.plan.series, colors: ["var(--ref)", "var(--s1)"]
  });
  src("#src-plan", D.plan.source, D.plan.note);

  /* 3. Альтернативные оценки */
  $("#g-official").textContent = "в " + D.growth.official + " раз";
  $("#g-khanin").textContent = "в " + D.growth.khanin.toLocaleString("ru-RU") + " раза";
  $("#g-extra").innerHTML = `<li>${D.growth.ofer}</li><li>${D.growth.allen}</li>`;
  src("#src-growth", D.growth.source);

  /* 4. Скот */
  barChart($("#chart-livestock"), {
    title: "Поголовье скота", categories: D.livestock.categories, unit: D.livestock.unit,
    catHead: "Вид скота", series: D.livestock.series
  });
  src("#src-livestock", D.livestock.source, D.livestock.note);

  /* 5. Экспорт зерна */
  barChart($("#chart-grain"), {
    title: "Экспорт зерна", categories: D.grain.years, unit: D.grain.unit, catHead: "Год",
    series: [{ name: "Экспорт зерна", values: D.grain.export }], table: false
  });
  $("#grain-harvest").innerHTML = D.grain.years.map((y, i) =>
    `<tr><th scope="row">${y}</th><td>${D.grain.harvestOfficial[i].toLocaleString("ru-RU")}</td><td>${D.grain.export[i].toLocaleString("ru-RU")}</td><td>${(D.grain.export[i] / D.grain.harvestOfficial[i] * 100).toLocaleString("ru-RU", { maximumFractionDigits: 1 })} %</td></tr>`).join("");
  src("#src-grain", D.grain.source, D.grain.note);

  /* 6. Урбанизация и 7. Грамотность */
  lineChart($("#chart-urban"), { title: "Городское население", years: D.urban.years, values: D.urban.values, unit: D.urban.unit, max: 100 });
  src("#src-urban", D.urban.source, D.urban.note);
  barChart($("#chart-literacy"), {
    title: "Грамотность", categories: D.literacy.years, unit: "%", catHead: "Перепись",
    series: [{ name: D.literacy.unit, values: D.literacy.values }], max: 100
  });
  src("#src-literacy", D.literacy.source, D.literacy.note);

  /* 8. Перепись 1937 */
  barChart($("#chart-census"), {
    title: "Перепись 1937 г.", categories: D.census37.categories, unit: D.census37.unit, catHead: "",
    series: [{ name: "Численность населения", values: D.census37.values }]
  });
  src("#src-census", D.census37.source, D.census37.note);

  /* 9. Голод */
  $("#famine-table").innerHTML = D.famine.map(f =>
    `<tr><th scope="row">${f.region}</th><td class="num">${f.estimate}</td><td>${f.who}</td></tr>`).join("");

  /* 10–11. Плитки */
  const tiles = (sel, arr) => $(sel).innerHTML = arr.map(t =>
    `<div class="tile"><div class="tile-v">${t.value}</div><div class="tile-l">${t.label}</div><div class="tile-s">${t.source}</div></div>`).join("");
  tiles("#tiles-repression", D.repression);


  /* ---------- новые наборы данных ---------- */
  barChart($("#chart-ab"), {
    title: "Группы А и Б", categories: D.groupAB.categories, unit: D.groupAB.unit, catHead: "Год",
    series: D.groupAB.series, max: 80
  });
  src("#src-ab", D.groupAB.source, D.groupAB.note);

  function drawConsumer(key) {
    const m = D.consumer.metrics[key];
    barChart($("#chart-consumer"), { title: m.label, categories: m.years, unit: m.unit, catHead: "Год", series: [{ name: m.label, values: m.values }] });
  }
  document.querySelectorAll("#consumer-switch button").forEach(b => b.addEventListener("click", () => {
    document.querySelectorAll("#consumer-switch button").forEach(x => x.setAttribute("aria-pressed", "false"));
    b.setAttribute("aria-pressed", "true"); drawConsumer(b.dataset.key);
  }));
  drawConsumer("cloth");
  src("#src-consumer", D.consumer.source, D.consumer.note);

  $("#tiles-defense").innerHTML = `<div class="tile"><div class="tile-v">${D.defense.value}</div><div class="tile-l">${D.defense.label}</div><div class="tile-s">${D.defense.source}</div></div>`;

  lineChart($("#chart-kolhoz"), { title: "Коллективизация", years: D.kolhoz.years, values: D.kolhoz.values, unit: D.kolhoz.unit, max: 100 });
  src("#src-kolhoz", D.kolhoz.source, D.kolhoz.note);

  $("#procurement-table").innerHTML = D.procurement.years.map((y, i) =>
    `<tr><th scope="row">${y}</th><td>${D.procurement.harvest[i].toLocaleString("ru-RU")}</td><td>${D.procurement.procured[i].toLocaleString("ru-RU")}</td></tr>`).join("");
  src("#src-procurement", D.procurement.source, D.procurement.note);

  barChart($("#chart-work"), { title: "Рабочие и служащие", categories: D.workforce.categories, unit: D.workforce.unit, catHead: "Год", series: [{ name: "Рабочие и служащие", values: D.workforce.values }] });
  src("#src-work", D.workforce.source);
  lineChart($("#chart-women"), { title: "Доля женщин", years: D.women.years, values: D.women.values, unit: D.women.unit, max: 50 });
  src("#src-women", D.women.source);
  barChart($("#chart-students"), { title: "Студенты", categories: D.students.categories, unit: D.students.unit, catHead: "Учебный год", series: [{ name: "Студенты вузов", values: D.students.values }] });
  src("#src-students", D.students.source, D.students.note);

  lineChart($("#chart-gulag"), { title: "Заключённые лагерей", years: D.gulag.years, values: D.gulag.values, unit: D.gulag.unit });
  src("#src-gulag", D.gulag.source, D.gulag.note);

  /* Подсветка текущего раздела в навигации */
  const links = [...document.querySelectorAll(".toc a")];
  const obs = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) links.forEach(a => {
      const on = a.getAttribute("href") === "#" + e.target.id;
      a.classList.toggle("on", on);
      if (on) { const bar = a.parentElement; bar.scrollTo({ left: a.offsetLeft - 16, behavior: "smooth" }); }
    });
  }), { rootMargin: "-40% 0px -55% 0px" });
  document.querySelectorAll("main section[id]").forEach(s => obs.observe(s));
});
