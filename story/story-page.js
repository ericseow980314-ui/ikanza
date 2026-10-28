(function () {
  "use strict";
  var i18n = window.IkanzaI18n;
  if (!i18n) return;

  var picker = document.querySelector("[data-language]");
  function showLanguage(lang) {
    i18n.translate(document.body, lang);
    i18n.translate(document.head, lang);
    if (picker) picker.value = lang;
  }
  showLanguage(i18n.current());
  if (picker) picker.addEventListener("change", function () {
    showLanguage(i18n.set(picker.value));
  });

  var menuButton = document.querySelector("[data-menu]");
  var menu = document.getElementById("story-mobile-menu");
  if (menuButton && menu) menuButton.addEventListener("click", function () {
    var open = menu.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
})();
