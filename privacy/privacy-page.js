(function () {
  "use strict";

  var button = document.getElementById("clear-preview-data");
  var status = document.getElementById("clear-status");
  if (!button || !status) return;
  button.disabled = false;

  button.addEventListener("click", function () {
    var localKeys = [
      "ikanza-demo-cart",
      "ikanza-preview-orders",
      "ikanza-preview-account",
      "ikanza-demo-language"
    ];
    var sessionKeys = ["ikanza-demo-last-order"];

    try {
      localKeys.forEach(function (key) { localStorage.removeItem(key); });
      sessionKeys.forEach(function (key) { sessionStorage.removeItem(key); });
      status.textContent = "Demo data removed from this browser. / Data contoh telah dipadam daripada pelayar ini. / 已从此浏览器清除示例资料。";
    } catch (_) {
      status.textContent = "Browser storage could not be cleared here. Use your browser's site-data settings. / Data pelayar tidak dapat dipadam di sini. Gunakan tetapan data laman pelayar anda. / 无法在此清除浏览器资料，请使用浏览器的网站资料设置。";
    }
  });
})();
