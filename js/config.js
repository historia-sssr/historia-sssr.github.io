/*
 * НАСТРОЙКИ ТЕСТА
 * SCRIPT_URL — адрес веб-приложения Google Apps Script (см. README, раздел «Google Таблица»).
 *              Пока он пустой, тест работает в демо-режиме: ответы никуда не отправляются.
 * SHOW_GRADE — показывать ли студенту оценку сразу после отправки.
 * EXITS_PER_PENALTY — сколько уходов со страницы снижают оценку на 1 балл.
 *              Это число только для показа студенту; сама оценка считается в Code.gs —
 *              меняйте значение в обоих файлах одновременно.
 */
window.TEST_CONFIG = {
  SCRIPT_URL: "https://script.google.com/macros/s/AKfycbzwFUnla4slNO5MvJ5YX0Maa8EcrpFsvHkl0r20h9kmRt658O7McxU3PpLsIDJzHMU/exec",
  SHOW_GRADE: true,
  EXITS_PER_PENALTY: 2
};
