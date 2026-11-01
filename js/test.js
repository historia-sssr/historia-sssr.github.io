/*
 * ТЕСТ. Здесь только тексты заданий — правильные ответы и баллы
 * хранятся в Google Apps Script (файл apps-script/Code.gs), поэтому студент их не видит.
 * Если меняете задания здесь, поменяйте ключ и в Code.gs (id заданий и вариантов должны совпадать).
 */
(function () {
  const ALL = [
    /* ===== ЧАСТЬ 1. РАБОТА С ДАННЫМИ ===== */
    { part: "Часть 1. Работа с данными", hint: "Ответы находятся расчётом по графикам и таблицам сайта. Возвращайтесь к данным по ссылкам «↑ к данным»." },
    { id: "q2", type: "slider", points: 1, title: "Расчёт",
      text: "Переключите график «Производство основных видов промышленной продукции» на «Уголь». Во сколько раз выросла добыча угля с 1928 по 1940 г.? Точность — до десятых.",
      min: 1, max: 8, step: 0.1, start: 1, suffix: "раза", link: "#industriya" },
    { id: "q3", type: "slider", points: 1, title: "Расчёт",
      text: "По графику «План и факт»: какую долю планового задания по стали (оптимальный вариант плана) составило фактическое производство 1932 г.?",
      min: 0, max: 150, step: 1, start: 0, suffix: "% плана", link: "#industriya" },
    { id: "q16", type: "slider", points: 1, title: "Расчёт",
      text: "На сколько процентов выросло производство хлопчатобумажных тканей с 1928 по 1940 г.? (График «А что с потребительскими товарами?»)",
      min: 0, max: 200, step: 1, start: 0, suffix: "%", link: "#industriya" },
    { id: "q15", type: "single", points: 1, title: "Работа с графиком",
      text: "Начиная с какого из приведённых на графике «Группа А и группа Б» лет продукция группы А составляла больше половины всей промышленной продукции?",
      options: [["1928", "1928"], ["1932", "1932"], ["1937", "1937"], ["1940", "1940"]] },
    { id: "q7", type: "slider", points: 1, title: "Расчёт",
      text: "По данным о поголовье скота: на сколько процентов сократилось поголовье овец с 1929 по 1933 г.?",
      min: 0, max: 100, step: 1, start: 0, suffix: "%", link: "#derevnya" },
    { id: "q14", type: "slider", points: 1, title: "Расчёт",
      text: "По таблице «Урожай и государственные заготовки зерна»: какую долю официального валового сбора 1931 г. составили государственные заготовки?",
      min: 0, max: 60, step: 1, start: 0, suffix: "% сбора", link: "#derevnya" },
    { id: "q17", type: "slider", points: 1, title: "Расчёт",
      text: "Во сколько раз выросло число студентов вузов с 1928/29 по 1940/41 учебный год? Точность — до десятых.",
      min: 1, max: 10, step: 0.1, start: 1, suffix: "раза", link: "#obshchestvo" },
    { id: "q18", type: "slider", points: 1, title: "Расчёт",
      text: "На сколько процентов выросло число заключённых в лагерях ГУЛАГа с 1 января 1937 г. по 1 января 1939 г.?",
      min: 0, max: 150, step: 1, start: 0, suffix: "%", link: "#cena" },

    /* ===== ЧАСТЬ 2. АНАЛИЗ ===== */
    { part: "Часть 2. Анализ и интерпретация", hint: "Здесь важно не найти цифру, а понять, что она означает." },
    { id: "q1", type: "single", points: 1, title: "Критика источника",
      text: "Почему для оценки индустриализации историки предпочитают натуральные показатели (тонны, кВт·ч), а не стоимостные?",
      options: [
        ["a", "Они точнее отражают качество продукции"],
        ["b", "Их труднее завысить за счёт скрытого роста цен"],
        ["c", "Только они публиковались в 1930-е гг."] ] },
    { id: "q24", type: "single", points: 1, title: "Интерпретация",
      text: "Какую черту советской модели развития отражает изменение соотношения групп А и Б в 1928–1940 гг.?",
      options: [
        ["a", "Приоритет тяжёлой промышленности перед выпуском предметов потребления"],
        ["b", "Опережающий рост лёгкой и пищевой промышленности"],
        ["c", "Сокращение производства машин и оборудования"] ] },
    { id: "q19", type: "multi", points: 2, title: "Выберите все верные",
      text: "Какие выводы подтверждаются графиком «Темпы коллективизации»? Отметьте все верные.",
      options: [
        ["a", "Основная масса крестьянских хозяйств вошла в колхозы в 1930–1931 гг."],
        ["b", "К 1937 г. колхозы объединяли более 90 % крестьянских хозяйств"],
        ["c", "Коллективизация шла равномерно, примерно одинаковыми темпами с 1928 по 1940 г."],
        ["d", "В 1932 г. вне колхозов оставалось больше половины крестьянских хозяйств"],
        ["e", "К середине 1930 г. в колхозах состояло меньше четверти крестьянских хозяйств"] ] },
    { id: "q20", type: "multi", points: 2, title: "Выберите все верные",
      text: "Какие утверждения о потребительских товарах подтверждаются данными сайта? Отметьте все верные.",
      options: [
        ["a", "В 1932 г. сахара произвели меньше, чем в 1913 г."],
        ["b", "В 1928 г. производство хлопчатобумажных тканей почти не отличалось от уровня 1913 г."],
        ["c", "Кожаной обуви в 1940 г. произвели более чем в 3,5 раза больше, чем в 1928 г."],
        ["d", "Производство тканей в 1928–1940 гг. росло быстрее, чем выплавка стали"],
        ["e", "К 1937 г. производство сахара превысило уровень 1913 г."] ] },
    { id: "q8", type: "single", points: 1, title: "Анализ",
      text: "Экспорт зерна в 1932–1933 гг. составлял около 2,5 % официального сбора. Почему историки всё же считают его значимым фактором голода?",
      options: [
        ["a", "Официальные сборы были завышены, а вывезенного зерна хватило бы, чтобы спасти многих людей"],
        ["b", "На самом деле экспорт составлял больше половины урожая"],
        ["c", "В 1932–1933 гг. экспорт зерна резко вырос по сравнению с 1930–1931 гг."] ] },
    { id: "q9", type: "single", points: 1, title: "Демография",
      text: "Почему итоги Всесоюзной переписи населения 1937 г. были засекречены, а её организаторы репрессированы?",
      options: [
        ["a", "Перепись показала численность населения заметно ниже той, о которой заявляло руководство"],
        ["b", "Перепись не успели завершить из-за начала войны"],
        ["c", "Перепись показала слишком быстрый рост городов, что противоречило планам"] ] },
    { id: "q10", type: "single", points: 1, title: "Критика источника",
      text: "Почему рост грамотности по переписи 1939 г. нужно сопоставлять с данными 1926 г. осторожно?",
      options: [
        ["a", "Перепись 1939 г. проводилась только в городах"],
        ["b", "Критерии грамотности в переписях различались"],
        ["c", "Данные переписи 1926 г. были засекречены"] ] },
    { id: "q11", type: "single", points: 1, title: "Долгая перспектива",
      text: "Почему высокие темпы роста ВВП на душу населения в 1921–1928 гг. (14,7 % в год) нельзя напрямую сравнивать с темпами 1928–1940 гг.?",
      options: [
        ["a", "Это был восстановительный рост после Первой мировой и Гражданской войн"],
        ["b", "В 1920-е гг. ВВП в СССР вообще не рассчитывался"],
        ["c", "НЭП в любых условиях был эффективнее плановой экономики"] ] },

    /* ===== ЧАСТЬ 3. ДОКУМЕНТЫ ===== */
    { part: "Часть 3. Работа с документами", hint: "Прочитайте фрагменты и определите, о чём они свидетельствуют." },
    { id: "q21", type: "match", points: 2, title: "Документ и контекст",
      text: "Сопоставьте фрагмент документа с историческим контекстом, в котором он появился.",
      left: [
        ["d1", "«Мы отстали от передовых стран на 50–100 лет. Мы должны пробежать это расстояние в десять лет. Либо мы сделаем это, либо нас сомнут»"],
        ["d2", "«Нельзя насаждать колхозы силой. Это было бы глупо и реакционно»"],
        ["d3", "Перепись «проведена с грубейшим нарушением элементарных основ статистической науки»"],
        ["d4", "«Жить стало лучше, товарищи. Жить стало веселее»"] ],
      right: [
        ["c", "засекречивание неудобных демографических данных"],
        ["a", "обоснование форсированных темпов индустриализации"],
        ["d", "пропаганда успехов после отмены карточек, на подъёме стахановского движения"],
        ["b", "временное отступление после массового недовольства крестьян"] ] },
    { id: "q22", type: "single", points: 1, title: "Документ",
      text: "Телеграмма секретаря Уральского обкома ВКП(б) И. Д. Кабакова (начало 1930-х гг.): «Категорически воспрещается производить публикацию в печати фактов расстрела кулацких элементов». О чём прежде всего свидетельствует этот документ?",
      options: [
        ["a", "Власти стремились скрыть от общества масштабы насилия в деревне"],
        ["b", "Расстрелы «кулаков» в 1930 г. не проводились"],
        ["c", "Местная печать была независима от партийных органов"] ] },
    { id: "q23", type: "single", points: 1, title: "Документ",
      text: "Из сводки о настроениях крестьян (Урал, конец 1920-х гг.): «…крестьяне говорят, что раз товару нет, то и скота нет, вот когда дадите товар, тогда дадим и скот… нет мануфактуры, а также и обуви». О какой проблеме идёт речь? Сопоставьте с данными о потребительских товарах.",
      options: [
        ["a", "Нехватка промышленных товаров лишала крестьян стимула продавать продукцию государству"],
        ["b", "Крестьяне требовали ускорить вступление в колхозы"],
        ["c", "В деревне был избыток промышленных товаров, которые некуда было девать"] ] },

    /* ===== ЧАСТЬ 4. СИНТЕЗ ===== */
    { part: "Часть 4. Обобщение", hint: "Задания охватывают материал всего сайта, включая хронику." },
    { id: "q4", type: "order", points: 3, title: "Хронология",
      text: "Расположите события в хронологическом порядке — от раннего к позднему.",
      items: [
        ["perepis", "Всесоюзная перепись населения, итоги которой засекретили"],
        ["golovokr", "Статья И. В. Сталина «Головокружение от успехов»"],
        ["ukaz1940", "Указ о запрете самовольного ухода с предприятий"],
        ["shahty", "«Шахтинское дело»"],
        ["prikaz", "Оперативный приказ НКВД № 00447"],
        ["kolosky", "«Закон о пяти колосках»"],
        ["stakhanov", "Рекорд А. Стаханова"],
        ["perelom", "Статья И. В. Сталина «Год великого перелома»"] ] },
    { id: "q5", type: "classify", points: 2, title: "Итоги или цена?",
      text: "Отнесите каждое явление к итогам модернизации или к её цене.",
      cats: [["itog", "Итог"], ["cena", "Цена"]],
      items: [
        ["i1", "Добыча угля за 1928–1940 гг. выросла почти в 4,7 раза"],
        ["i2", "Поголовье лошадей сократилось почти вдвое"],
        ["i3", "Доля горожан выросла с 18 до 33 %"],
        ["i4", "Голод 1932–1933 гг."],
        ["i5", "Грамотность населения 9–49 лет достигла 87 %"],
        ["i6", "Выселение более 1,8 млн человек при раскулачивании"],
        ["i7", "Новые промышленные центры — Магнитогорск, Кузбасс"],
        ["i8", "Массовый принудительный труд на стройках"],
        ["i9", "Число студентов вузов выросло более чем в 4 раза"],
        ["i10", "Производство сахара в 1932 г. упало ниже уровня 1913 г."] ] },
    { id: "q6", type: "match", points: 3, title: "Цифра и смысл",
      text: "Сопоставьте каждую цифру с тем, что она означает.",
      left: [["n1", "681 692"], ["n2", "1 803 392"], ["n3", "162 млн"], ["n4", "в 90 раз"], ["n5", "в 6,9 раза"], ["n6", "811,7 тыс."], ["n7", "1 317 195"]],
      right: [
        ["c", "население СССР по переписи 1937 г."],
        ["g", "заключённые лагерей ГУЛАГа на 1 января 1939 г."],
        ["e", "рост национального дохода 1928–1987 гг. по расчётам Г. Ханина"],
        ["a", "приговорены к расстрелу в 1937–1938 гг."],
        ["f", "студенты вузов в 1940/41 учебном году"],
        ["d", "рост национального дохода 1928–1987 гг. по данным ЦСУ"],
        ["b", "выселены при раскулачивании в 1930–1931 гг."] ] },
    { id: "q12", type: "truefalse", points: 3, title: "Верно или неверно?",
      text: "Оцените каждое утверждение.",
      items: [
        ["t1", "Первую пятилетку объявили выполненной за 4 года и 3 месяца."],
        ["t2", "В 1930-е гг. колхозники получали паспорта наравне с горожанами."],
        ["t3", "По оценке Р. Аллена, потребление на душу населения в 1928–1937 гг. выросло примерно на 27 %."],
        ["t4", "С началом голода в 1932 г. экспорт зерна был полностью прекращён."],
        ["t5", "В 1940 г. было введено платное обучение в вузах."],
        ["t6", "После окончания «Большого террора» число заключённых в лагерях ГУЛАГа сократилось (1939–1941)."] ] },

    /* ===== ЧАСТЬ 5. РАЗВЁРНУТЫЕ ОТВЕТЫ ===== */
    { part: "Часть 5. Развёрнутые ответы", hint: "Эти ответы оценивает преподаватель. Опирайтесь на конкретные цифры с сайта." },
    { id: "q25", type: "open", points: 0, title: "Ресурсы индустриализации",
      text: "За счёт каких ресурсов — материальных и человеческих — проводилась индустриализация? Приведите не менее трёх показателей из разных разделов сайта и объясните, как они связаны между собой.",
      minLength: 300 },
    { id: "q13", type: "open", points: 0, title: "Итоговая оценка",
      text: "Оправдана ли цена советской модернизации? Сформулируйте свою позицию, приведите не менее двух аргументов с цифрами и один контраргумент, который могли бы выдвинуть ваши оппоненты.",
      minLength: 300 }
  ];
  const TASKS = ALL.filter(t => t.id);

  const cfg = window.TEST_CONFIG || {};
  const PER = cfg.EXITS_PER_PENALTY || 2;
  const STORE = "sm-test-v2";
  const $ = id => document.getElementById(id);
  const startForm = $("start-form"), form = $("test-form"), box = $("tasks");
  if (!startForm || !form) return;
  // местное время в формате ГГГГ-ММ-ДДTЧЧ:ММ:СС (для журнала уходов в таблице)
  const localStamp = () => new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 19);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  document.querySelectorAll(".exits-per").forEach(x => x.textContent = PER);

  /* ---------- состояние (переживает перезагрузку страницы) ---------- */
  let state = null;
  function load() { try { return JSON.parse(localStorage.getItem(STORE)); } catch (e) { return null; } }
  function save() { try { localStorage.setItem(STORE, JSON.stringify(state)); } catch (e) {} }

  /* ---------- отрисовка заданий ---------- */
  function render() {
    let idx = -1;
    ALL.forEach(t => {
      if (!t.id) {
        const h = document.createElement("div");
        h.className = "part-head";
        h.innerHTML = `<h3>${esc(t.part)}</h3>${t.hint ? `<p>${esc(t.hint)}</p>` : ""}`;
        box.appendChild(h);
        return;
      }
      idx++;
      const el = document.createElement("fieldset");
      el.className = "task task-" + t.type;
      el.dataset.id = t.id;
      const pts = t.points ? `${t.points} ${t.points === 1 ? "балл" : "балла"}` : "оценивает преподаватель";
      let html = `<legend><span class="t-num">${idx + 1}</span><span class="t-kind">${esc(t.title)} · ${pts}</span></legend><p class="t-text">${esc(t.text)}</p>`;
      if (t.type === "single") {
        html += `<div class="opts">` + t.options.map(([v, l]) =>
          `<label class="opt"><input type="radio" name="${t.id}" value="${v}"><span>${esc(l)}</span></label>`).join("") + `</div>`;
      }
      if (t.type === "number") {
        html += `<div class="num-row"><input type="text" inputmode="decimal" name="${t.id}" placeholder="${esc(t.placeholder)}" class="num-in"><span>${esc(t.suffix)}</span>` +
          (t.link ? `<a href="${t.link}" class="back">↑ к графику</a>` : "") + `</div>`;
      }
      if (t.type === "multi") {
        html += `<div class="opts">` + t.options.map(([v, l]) =>
          `<label class="opt opt-multi"><input type="checkbox" name="${t.id}" value="${v}"><span>${esc(l)}</span></label>`).join("") + `</div>`;
      }
      if (t.type === "slider") {
        html += `<div class="slider-row"><button type="button" class="step" data-d="-1" aria-label="Меньше">−</button>` +
          `<input type="range" name="${t.id}" min="${t.min}" max="${t.max}" step="${t.step}" value="${t.start}">` +
          `<button type="button" class="step" data-d="1" aria-label="Больше">+</button>` +
          `<output class="slider-val" for="${t.id}">—</output><span class="slider-suf">${esc(t.suffix)}</span></div>` +
          `<div class="slider-scale"><span>${String(t.min).replace(".", ",")}</span>` + (t.link ? `<a href="${t.link}" class="back">↑ к данным</a>` : "") + `<span>${String(t.max).replace(".", ",")}</span></div>`;
      }
      if (t.type === "order") {
        html += `<ol class="order-list">` + t.items.map(([v, l]) =>
          `<li data-v="${v}"><span class="o-label">${esc(l)}</span><span class="o-btns"><button type="button" class="up" aria-label="Выше">↑</button><button type="button" class="down" aria-label="Ниже">↓</button></span></li>`).join("") + `</ol>`;
      }
      if (t.type === "classify" || t.type === "truefalse") {
        const cats = t.type === "classify" ? t.cats : [["true", "Верно"], ["false", "Неверно"]];
        html += `<div class="cls">` + t.items.map(([v, l]) =>
          `<div class="cls-row" data-v="${v}"><span class="cls-label">${esc(l)}</span><span class="cls-btns">` +
          cats.map(([c, cl], ci) => `<label class="pill pill-${ci ? "b" : "a"}"><input type="radio" name="${t.id}-${v}" value="${c}"><span>${cl}</span></label>`).join("") +
          `</span></div>`).join("") + `</div>`;
      }
      if (t.type === "match") {
        html += `<div class="match">` + t.left.map(([v, l]) =>
          `<label class="match-row"><span class="m-left">${esc(l)}</span><select name="${t.id}-${v}"><option value="">— выберите —</option>` +
          t.right.map(([rv, rl]) => `<option value="${rv}">${esc(rl)}</option>`).join("") + `</select></label>`).join("") + `</div>`;
      }
      if (t.type === "open") {
        html += `<textarea name="${t.id}" rows="6" placeholder="Ваш ответ…"></textarea><p class="hint counter">0 знаков (минимум ${t.minLength})</p>`;
      }
      el.innerHTML = html;
      box.appendChild(el);
    });

    box.querySelectorAll(".order-list").forEach(list => list.addEventListener("click", e => {
      const b = e.target.closest("button"); if (!b) return;
      const li = b.closest("li");
      if (b.classList.contains("up") && li.previousElementSibling) list.insertBefore(li, li.previousElementSibling);
      if (b.classList.contains("down") && li.nextElementSibling) list.insertBefore(li.nextElementSibling, li);
      li.classList.add("moved"); setTimeout(() => li.classList.remove("moved"), 300);
      state.touched = state.touched || {}; state.touched[li.closest(".task").dataset.id] = 1;
      changed();
    }));
    box.querySelectorAll(".task-slider").forEach(el => {
      const inp = el.querySelector("input[type=range]");
      const mark = () => { state.touched = state.touched || {}; state.touched[el.dataset.id] = 1; showVal(inp); changed(); };
      inp.addEventListener("input", mark);
      el.querySelectorAll(".step").forEach(b => b.addEventListener("click", () => {
        const st = +inp.step, v = Math.min(+inp.max, Math.max(+inp.min, +inp.value + st * +b.dataset.d));
        inp.value = Math.round(v / st) * st; mark();
      }));
    });
    box.querySelectorAll("textarea").forEach(ta => ta.addEventListener("input", () => counter(ta)));
    form.addEventListener("input", changed);
    form.addEventListener("change", changed);
  }
  function showVal(inp) {
    const t = TASKS.find(x => x.id === inp.name);
    const dec = String(t.step).includes(".") ? 1 : 0;
    inp.closest(".task").querySelector(".slider-val").textContent = (+inp.value).toFixed(dec).replace(".", ",");
    inp.style.setProperty("--p", ((inp.value - t.min) / (t.max - t.min) * 100) + "%");
  }
  function counter(ta) {
    const t = TASKS.find(x => x.id === ta.name);
    ta.nextElementSibling.textContent = `${ta.value.trim().length} знаков (минимум ${t.minLength})`;
  }

  /* ---------- сбор и восстановление ответов ---------- */
  function collect() {
    const fd = new FormData(form), a = {};
    TASKS.forEach(t => {
      if (t.type === "single" || t.type === "number" || t.type === "open") a[t.id] = (fd.get(t.id) || "").trim();
      if (t.type === "multi") a[t.id] = fd.getAll(t.id);
      if (t.type === "slider") a[t.id] = state.touched && state.touched[t.id] ? String(fd.get(t.id)) : "";
      if (t.type === "order") a[t.id] = [...box.querySelectorAll(`[data-id="${t.id}"] li`)].map(li => li.dataset.v);
      if (t.type === "classify" || t.type === "truefalse" || t.type === "match") {
        a[t.id] = {};
        (t.items || t.left).forEach(([v]) => { a[t.id][v] = fd.get(`${t.id}-${v}`) || ""; });
      }
    });
    return a;
  }
  function restore(a) {
    if (!a) return;
    TASKS.forEach(t => {
      const v = a[t.id]; if (v == null) return;
      if (t.type === "single") { const r = form.querySelector(`input[name="${t.id}"][value="${v}"]`); if (r) r.checked = true; }
      if (t.type === "multi" && Array.isArray(v)) v.forEach(x => { const c = form.querySelector(`input[name="${t.id}"][value="${x}"]`); if (c) c.checked = true; });
      if (t.type === "slider" && v !== "") { const f = form.elements[t.id]; f.value = v; showVal(f); }
      if (t.type === "number" || t.type === "open") { const f = form.elements[t.id]; f.value = v; if (t.type === "open") counter(f); }
      if (t.type === "order") { const list = box.querySelector(`[data-id="${t.id}"] .order-list`); v.forEach(id => { const li = list.querySelector(`[data-v="${id}"]`); if (li) list.appendChild(li); }); }
      if (typeof v === "object" && !Array.isArray(v)) Object.keys(v).forEach(k => {
        if (!v[k]) return;
        if (t.type === "match") form.elements[`${t.id}-${k}`].value = v[k];
        else { const r = form.querySelector(`input[name="${t.id}-${k}"][value="${v[k]}"]`); if (r) r.checked = true; }
      });
    });
  }
  function isDone(t, a) {
    const v = a[t.id];
    if (t.type === "order" || t.type === "slider") return !!(state.touched && state.touched[t.id]);
    if (t.type === "open") return v.length >= t.minLength;
    if (t.type === "multi") return v.length > 0;
    if (t.type === "number") return /^-?\d+([.,]\d+)?$/.test(v);
    if (typeof v === "object") return Object.values(v).every(x => x !== "");
    return v !== "";
  }
  function changed() {
    const a = collect();
    state.answers = a; save();
    const done = TASKS.filter(t => isDone(t, a)).length;
    $("progress").textContent = `Выполнено заданий: ${done} из ${TASKS.length}`;
    TASKS.forEach(t => box.querySelector(`[data-id="${t.id}"]`).classList.toggle("done", isDone(t, a)));
  }

  /* ---------- контроль уходов со страницы ---------- */
  let away = false, lastExit = 0;
  function penalty() { return Math.floor(state.exits / PER); }
  function tick() {
    if (!state || !state.started || state.submitted) return;
    const sec = Math.round((Date.now() - (state.startMs || Date.now())) / 1000);
    const el = $("timer"); if (el) el.textContent = `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;
  }
  setInterval(tick, 1000);
  function updateBar() {
    $("exit-count").textContent = state.exits;
    $("exit-pen").textContent = penalty() ? `−${penalty()}` : "0";
    $("exit-bar").classList.toggle("warn", state.exits > 0);
  }
  function registerExit(reason) {
    if (!state || !state.started || state.submitted) return;
    const now = Date.now();
    if (away || now - lastExit < 1500) return;      // один уход — одна запись (blur и visibilitychange приходят парой)
    away = true; lastExit = now;
    state.exits++; state.exitLog = (state.exitLog || []).concat([{ t: localStamp(), ms: Date.now(), r: reason }]);
    save(); updateBar();
  }
  function cameBack() {
    if (!away || !state || state.submitted) { away = false; return; }
    away = false;
    const left = PER - (state.exits % PER);
    $("exit-text").innerHTML = `Уходов со страницы: <b>${state.exits}</b>. Снижение оценки сейчас: <b>${penalty()}</b>.<br>` +
      `Ещё ${left} ${left === 1 ? "уход снизит" : "ухода снизят"} оценку на 1 балл.`;
    $("exit-modal").hidden = false;
    $("exit-ok").focus();
  }
  document.addEventListener("visibilitychange", () => document.hidden ? registerExit("вкладка скрыта") : cameBack());
  window.addEventListener("blur", () => registerExit("окно потеряло фокус"));
  window.addEventListener("focus", cameBack);
  $("exit-ok").addEventListener("click", () => { $("exit-modal").hidden = true; });

  /* ---------- старт ---------- */
  function begin(resumed) {
    startForm.hidden = true;
    form.hidden = false;
    $("exit-bar").hidden = false;
    $("who").innerHTML = `<b>${esc(state.surname)} ${esc(state.firstname)}</b>, группа ${esc(state.group)}`;
    if (!box.children.length) render();
    restore(state.answers);
    changed(); updateBar();
    if (resumed) {
      $("exit-text").innerHTML = `Страница была перезагружена или закрыта — это считается уходом.<br>Уходов со страницы: <b>${state.exits}</b>. Снижение оценки: <b>${penalty()}</b>. Ваши ответы сохранены.`;
      $("exit-modal").hidden = false;
    }
  }
  startForm.addEventListener("submit", e => {
    e.preventDefault();
    const f = startForm.elements;
    const surname = f.surname.value.trim(), firstname = f.firstname.value.trim(), group = f.group.value.trim();
    if (surname.length < 2 || firstname.length < 2 || !group) {
      $("start-msg").textContent = "Заполните фамилию, имя и группу — без этого тест не откроется.";
      return;
    }
    state = { surname, firstname, group, started: true, startedAt: localStamp(), startMs: Date.now(), exits: 0, exitLog: [], answers: null, touched: {} };
    save();
    begin(false);
    form.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  /* ---------- отправка ---------- */
  const result = $("result");
  function show(html, cls) { result.hidden = false; result.className = "result " + (cls || ""); result.innerHTML = html; result.scrollIntoView({ behavior: "smooth", block: "center" }); }
  function showResult(r, again) {
    const head = again ? "<p><b>Вы уже отправили ответы.</b> Повторная отправка невозможна.</p>" : "<p><b>Ответы отправлены преподавателю.</b></p>";
    if (!r || !cfg.SHOW_GRADE) { show(head + "<p>Результат вы узнаете на занятии.</p>", "ok"); return; }
    const pen = r.penalty ? `<br>Уходов со страницы: ${r.exits}, оценка снижена на ${r.penalty} (без снижения — ${r.baseGrade}).` : "";
    show(`<div class="grade">${r.grade}</div>${head}<p>Баллы за автоматически проверяемые задания: ${r.score} из ${r.max}.${pen}<br>Развёрнутые ответы преподаватель оценит отдельно.</p>`, "ok");
  }

  form.addEventListener("submit", async e => {
    e.preventDefault();
    const a = collect();
    const missing = TASKS.map((t, i) => isDone(t, a) ? null : i + 1).filter(Boolean);
    if (missing.length) {
      show(`Не выполнены задания: ${missing.join(", ")}. Ползунки нужно передвинуть, а в «Хронологии» — хотя бы раз переставить события; каждый развёрнутый ответ — не короче 300 знаков.`, "warn");
      return;
    }
    const payload = {
      surname: state.surname, firstname: state.firstname, group: state.group,
      answers: a, exits: state.exits, exitLog: state.exitLog,
      startedAt: state.startedAt, durationSec: Math.round((Date.now() - (state.startMs || Date.now())) / 1000)
    };
    if (!cfg.SCRIPT_URL) {
      show("<b>Демо-режим.</b> Отправка в Google Таблицу ещё не настроена (адрес скрипта не указан в <code>js/config.js</code>). Ответы никуда не отправлены.", "warn");
      return;
    }
    const btn = form.querySelector(".submit-btn");
    btn.disabled = true; btn.textContent = "Отправляю…";
    try {
      // text/plain — чтобы браузер не делал предварительный CORS-запрос к Google
      const r = await fetch(cfg.SCRIPT_URL, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(payload) });
      const data = await r.json();
      if (!data.ok) throw new Error(data.error || "ошибка сервера");
      state.submitted = true; state.result = data; save();
      form.querySelectorAll("input, select, textarea, button").forEach(x => x.disabled = true);
      btn.textContent = "Ответы отправлены";
      $("exit-bar").hidden = true;
      showResult(data, false);
    } catch (err) {
      btn.disabled = false; btn.textContent = "Отправить ответы";
      show(`Не удалось отправить ответы (${esc(err.message)}). Проверьте интернет и попробуйте ещё раз — ответы сохранены на этой странице.`, "warn");
    }
  });
  const prev = load();
  if (prev && prev.started) {
    state = prev;
    if (prev.submitted) {
      startForm.hidden = true;
      showResult(prev.result, true);
    } else {
      // перезагрузка/закрытие страницы во время теста — один уход.
      // Если браузер уже засчитал уход при выгрузке страницы (visibilitychange), второй раз не считаем.
      state.exitLog = state.exitLog || [];
      const last = state.exitLog[state.exitLog.length - 1];
      if (last && last.ms && Date.now() - last.ms < 10000) last.r = "перезагрузка/закрытие страницы";
      else { state.exits++; state.exitLog.push({ t: localStamp(), r: "перезагрузка/закрытие страницы" }); }
      save();
      begin(true);
    }
  }

})();
