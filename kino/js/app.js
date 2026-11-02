/*
 * Раздел «Кино и общество»: переходы по таймкодам, регистрация, тесты, счётчик уходов, отправка в Google Таблицу.
 */
(function () {
  "use strict";
  var CFG = window.KINO_CONFIG || {};
  var TESTS = window.KINO_TESTS;
  var SPLIT = 1207; // секунда исходного видео о сталинском кино, с которой начинается часть 2
  var STORE = "kino-tests-v1";

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function fmt(sec) { sec = Math.max(0, Math.round(sec)); var m = Math.floor(sec / 60), s = sec % 60; return m + ":" + (s < 10 ? "0" : "") + s; }

  /* ---------- состояние (хранится в браузере) ---------- */
  var state = load() || { fio: "", group: "", tests: {} };
  function load() { try { return JSON.parse(localStorage.getItem(STORE)); } catch (e) { return null; } }
  function save() { try { localStorage.setItem(STORE, JSON.stringify(state)); } catch (e) {} }
  function ts(id) { return state.tests[id] || (state.tests[id] = { started: false, submitted: false, answers: {}, exits: 0, log: [], order: {}, t0: 0 }); }

  /* ---------- видео: переход к нужному месту ---------- */
  function locate(video, t) {
    if (video === "stalin") return t >= SPLIT ? { id: "v-stalin-2", t: t - SPLIT, part: 2 } : { id: "v-stalin-1", t: t, part: 1 };
    return { id: "v-zastoy-1", t: t, part: 0 };
  }
  function seek(video, t) {
    var L = locate(video, t), v = document.getElementById(L.id);
    if (!v) return;
    $$("video").forEach(function (o) { if (o !== v && !o.paused) o.pause(); });
    var box = v.closest(".player");
    seekingByUs = Date.now();
    box.scrollIntoView({ behavior: "smooth", block: "center" });
    box.classList.add("flash"); setTimeout(function () { box.classList.remove("flash"); }, 1600);
    var go = function () { try { v.currentTime = L.t; } catch (e) {} var p = v.play(); if (p && p.catch) p.catch(function () {}); };
    if (v.readyState >= 1) go(); else { v.addEventListener("loadedmetadata", go, { once: true }); v.load(); }
  }
  $$(".chapters").forEach(function (ol) {
    ol.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-t]"); if (b) seek(ol.dataset.video, +b.dataset.t);
    });
  });
  function whereLabel(video, w) {
    if (video !== "stalin") return fmt(w[0]) + "–" + fmt(w[1]);
    var a = locate(video, w[0]);
    var end = a.part === 1 ? Math.min(w[1], SPLIT) : w[1] - SPLIT; // фрагменты не пересекают границу частей
    return "часть " + a.part + ", " + fmt(a.t) + "–" + fmt(end);
  }

  /* ---------- регистрация ---------- */
  var reg = $("#reg"), fio = $("#fio"), grp = $("#group"), regErr = $("#reg-err"), who = $("#who");
  function showWho() {
    var ok = !!(state.fio && state.group);
    $$(".pick").forEach(function (p) { p.disabled = !ok; });
    fio.value = state.fio; grp.value = state.group;
    if (ok) {
      who.hidden = false;
      var locked = Object.keys(state.tests).some(function (k) { return state.tests[k].started; });
      who.innerHTML = "Тест проходит: <b>" + esc(state.fio) + "</b>, группа <b>" + esc(state.group) + "</b>." +
        (locked ? "" : " <button type=\"button\" id=\"edit-who\">Изменить</button>");
      reg.querySelectorAll("label, .btn, h3").forEach(function (el) { el.hidden = true; });
      var e = $("#edit-who"); if (e) e.onclick = function () { reg.querySelectorAll("label, .btn, h3").forEach(function (el) { el.hidden = false; }); who.hidden = true; fio.focus(); };
    } else {
      who.hidden = true;
      reg.querySelectorAll("label, .btn, h3").forEach(function (el) { el.hidden = false; });
    }
    updatePicks();
  }
  reg.addEventListener("submit", function (e) {
    e.preventDefault();
    var f = fio.value.replace(/\s+/g, " ").trim(), g = grp.value.replace(/\s+/g, " ").trim();
    var err = "";
    if (f.split(" ").length < 2 || f.length < 5) err = "Введите фамилию и имя полностью (лучше и отчество).";
    else if (!g) err = "Укажите группу.";
    regErr.hidden = !err; regErr.textContent = err;
    if (err) return;
    state.fio = f; state.group = g; save(); showWho();
    $("#testpick").scrollIntoView({ behavior: "smooth", block: "nearest" });
  });

  /* ---------- выбор теста ---------- */
  var current = null;
  function updatePicks() {
    $$(".pick").forEach(function (p) {
      var t = state.tests[p.dataset.test], st = $('.st[data-st="' + p.dataset.test + '"]');
      st.textContent = !t || !t.started ? "не начат" : t.submitted ? "отправлен" + (t.result && t.result.grade && CFG.SHOW_GRADE ? " · оценка " + t.result.grade : "") : "в процессе";
      p.classList.toggle("on", p.dataset.test === current);
    });
  }
  $$(".pick").forEach(function (p) {
    p.addEventListener("click", function () { if (!p.disabled) open(p.dataset.test, true); });
  });

  function open(id, scroll) {
    current = id;
    $$(".test").forEach(function (el) { el.hidden = el.id !== "test-" + id; });
    render(id);
    updatePicks(); updateBar();
    if (scroll) $("#test-" + id).scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /* ---------- отрисовка теста ---------- */
  function shuffled(arr) { var a = arr.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var x = a[i]; a[i] = a[j]; a[j] = x; } return a; }

  function render(id) {
    var T = TESTS[id], S = ts(id), box = $("#test-" + id);
    if (!S.started) {
      box.innerHTML = '<div class="card"><h3 class="ttl">' + esc(T.title) + '</h3>' +
        '<p>20 вопросов: ' + T.questions.filter(function (q) { return q.type === "single"; }).length + ' с выбором ответа и ' +
        T.questions.filter(function (q) { return q.type === "open"; }).length + ' открытых. После нажатия «Начать» включится счётчик уходов со страницы.</p>' +
        '<button class="btn" id="start-' + id + '">Начать тест</button></div>';
      $("#start-" + id).onclick = function () {
        S.started = true; S.t0 = Date.now(); S.exits = 0; S.log = [];
        T.questions.forEach(function (q) { if (q.options) S.order[q.id] = shuffled(q.options.map(function (o) { return o[0]; })); });
        save(); showWho(); render(id); updateBar();
      };
      return;
    }
    var h = '<h3 class="ttl">' + esc(T.title) + '</h3>';
    T.questions.forEach(function (q) {
      var a = S.answers[q.id];
      h += '<div class="q" id="q-' + q.id + '"><div class="qhead"><span class="qn">' + q.n + '</span>' +
        '<span class="qtype' + (q.type === "open" ? " open" : "") + '">' + (q.type === "open" ? "Открытый ответ" : "Выбор ответа") + '</span></div>' +
        '<p class="qtext">' + esc(q.text) + '</p><div class="where">Где смотреть: ';
      q.where.forEach(function (w) { h += '<button type="button" class="seek" data-t="' + w[0] + '">▶ ' + whereLabel(T.video, w) + '</button>'; });
      h += '</div>';
      if (q.type === "single") {
        var byId = {}; q.options.forEach(function (o) { byId[o[0]] = o[1]; });
        (S.order[q.id] || q.options.map(function (o) { return o[0]; })).forEach(function (oid) {
          h += '<label class="opt"><input type="radio" name="' + id + '-' + q.id + '" value="' + oid + '"' + (a === oid ? " checked" : "") + '><span>' + esc(byId[oid]) + '</span></label>';
        });
      } else {
        h += '<textarea data-q="' + q.id + '" maxlength="3000" placeholder="Ваш ответ своими словами">' + esc(a || "") + '</textarea><div class="chars"><span>' + (a || "").length + '</span>/3000</div>';
      }
      h += '</div>';
    });
    h += '<div class="submit">' + (S.submitted ? "" : '<button class="btn" id="send-' + id + '">Отправить ответы</button>') + '<span class="sendmsg"></span></div><div class="result" hidden></div>';
    box.innerHTML = h;
    box.classList.toggle("locked", S.submitted);

    box.onclick = function (e) {
      var s = e.target.closest(".seek"); if (s) seek(T.video, +s.dataset.t);
    };
    box.onchange = function (e) {
      if (S.submitted) return;
      var r = e.target;
      if (r.type === "radio") { S.answers[r.name.slice(id.length + 1)] = r.value; r.closest(".q").classList.remove("missing"); save(); updateBar(); }
    };
    box.oninput = function (e) {
      if (S.submitted) return;
      var ta = e.target; if (!ta.dataset.q) return;
      S.answers[ta.dataset.q] = ta.value; ta.nextElementSibling.firstChild.textContent = ta.value.length;
      clearTimeout(ta._t); ta._t = setTimeout(function () { save(); updateBar(); }, 300);
    };
    if (!S.submitted) $("#send-" + id).onclick = function () { send(id); };
    else if (S.result) showResult(id, S.result);
  }

  function answered(id) {
    var S = ts(id); return TESTS[id].questions.filter(function (q) { var a = S.answers[q.id]; return a && String(a).trim(); }).length;
  }

  /* ---------- счётчик уходов ---------- */
  var away = false, lastExit = 0, seekingByUs = 0, dialog = false;
  function ask(text) { dialog = true; var r = window.confirm(text); setTimeout(function () { dialog = false; }, 600); return r; }
  function active() { return Object.keys(state.tests).filter(function (k) { var t = state.tests[k]; return t.started && !t.submitted; }); }
  function inFullscreen() {
    if (document.fullscreenElement || document.webkitFullscreenElement) return true;
    return $$("video").some(function (v) { return v.webkitDisplayingFullscreen; });
  }
  function registerExit(reason) {
    var act = active(); if (!act.length) return;
    var now = Date.now();
    if (away || now - lastExit < 1500) return;          // один уход — одна запись (blur и скрытие вкладки приходят парой)
    if (reason === "blur" && (inFullscreen() || dialog || now - seekingByUs < 1500)) return; // полноэкранное видео и окно «Отправить?» — не уход
    away = true; lastExit = now;
    var d = new Date(), stamp = d.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    act.forEach(function (k) { var t = state.tests[k]; t.exits++; t.log.push(stamp); });
    save(); updateBar();
  }
  function cameBack() { if (!document.hidden) away = false; }
  document.addEventListener("visibilitychange", function () { document.hidden ? registerExit("hidden") : cameBack(); });
  window.addEventListener("blur", function () { setTimeout(function () { if (!document.hasFocus()) registerExit("blur"); }, 120); });
  window.addEventListener("focus", cameBack);
  window.addEventListener("pagehide", function () { registerExit("hidden"); });

  /* ---------- нижняя плашка ---------- */
  var bar = $("#bar");
  function updateBar() {
    var S = current && state.tests[current];
    var show = !!(S && S.started && !S.submitted);
    bar.hidden = !show; document.body.classList.toggle("testing", show);
    if (!show) return;
    $("#bar-test").textContent = current === "stalin" ? "Тест 1" : "Тест 2";
    $("#bar-done").textContent = answered(current);
    $("#bar-exits").textContent = S.exits;
  }

  /* ---------- отправка ---------- */
  function device() {
    var u = navigator.userAgent;
    var os = /iPhone|iPad|iPod/.test(u) ? "iOS" : /Android/.test(u) ? "Android" : /Windows/.test(u) ? "Windows" : /Mac/.test(u) ? "macOS" : "другое";
    return os + ", экран " + screen.width + "×" + screen.height;
  }
  function send(id) {
    var T = TESTS[id], S = ts(id), box = $("#test-" + id), msg = box.querySelector(".sendmsg");
    var missing = T.questions.filter(function (q) { var a = S.answers[q.id]; return !(a && String(a).trim()); });
    $$(".q", box).forEach(function (el) { el.classList.remove("missing"); });
    missing.forEach(function (q) { $("#q-" + q.id).classList.add("missing"); });
    if (missing.length && !ask("Без ответа вопросов: " + missing.length + " (" + missing.map(function (q) { return q.n; }).join(", ") + "). Всё равно отправить? Изменить ответы после отправки нельзя.")) {
      $("#q-" + missing[0].id).scrollIntoView({ behavior: "smooth", block: "center" }); return;
    }
    if (!missing.length && !ask("Отправить ответы? Изменить их после отправки нельзя.")) return;

    var mins = Math.round((Date.now() - (S.t0 || Date.now())) / 60000);
    var payload = { test: id, fio: state.fio, group: state.group, answers: S.answers, exits: S.exits,
      exitLog: S.log.join(", "), duration: mins + " мин", device: device() };

    if (!CFG.SCRIPT_URL) {
      showResult(id, { demo: true }); return;
    }
    var btn = $("#send-" + id); btn.disabled = true; msg.textContent = "Отправляю…";
    fetch(CFG.SCRIPT_URL, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(payload) })
      .then(function (r) { return r.json(); })
      .then(function (r) {
        if (!r.ok) throw new Error(r.error || "ошибка скрипта");
        S.submitted = true; S.result = r; save();
        render(id); showWho(); updateBar();
      })
      .catch(function (err) {
        btn.disabled = false;
        msg.textContent = "Не удалось отправить (" + err.message + "). Проверьте интернет и нажмите ещё раз — ответы сохранены.";
      });
  }

  function showResult(id, r) {
    var box = $("#test-" + id), res = box.querySelector(".result"); res.hidden = false;
    if (r.demo) {
      res.className = "result warn";
      res.innerHTML = "<p><b>Демо-режим.</b> Таблица преподавателя ещё не подключена, поэтому ответы никуда не отправлены. Сообщите об этом преподавателю.</p>";
    } else {
      res.className = "result ok";
      res.innerHTML = "<p><b>Ответы отправлены.</b> Спасибо!</p>" +
        (CFG.SHOW_GRADE ? '<p>Оценка за вопросы с выбором ответа (' + r.score + " из " + r.max + '):</p><div class="big">' + r.grade + "</div>" +
          "<p>Открытые ответы проверит преподаватель — итоговая оценка может измениться.</p>" : "") +
        "<p>Уходов со страницы во время теста: <b>" + ts(id).exits + "</b>.</p>";
    }
    res.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  /* ---------- старт ---------- */
  showWho();
  var act = active();
  if (act.length) open(act[0], false);
})();
