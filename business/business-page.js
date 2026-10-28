(function () {
  "use strict";

  var i18n = window.IkanzaI18n;
  var picker = document.querySelector("[data-language]");
  function showLanguage(lang) {
    if (!i18n) return;
    i18n.translate(document.body, lang);
    i18n.translate(document.head, lang);
    if (picker) picker.value = lang;
  }
  if (i18n) showLanguage(i18n.current());
  if (picker && i18n) picker.addEventListener("change", function () {
    showLanguage(i18n.set(picker.value));
  });

  var menuButton = document.querySelector("[data-menu]");
  var menu = document.getElementById("business-mobile-menu");
  if (menuButton && menu) menuButton.addEventListener("click", function () {
    var open = menu.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });

  var form = document.getElementById("business-form");
  var result = document.getElementById("business-confirmation");
  var previewButton = document.getElementById("business-preview-button");
  var sampleButton = document.getElementById("business-sample-fill");
  var startAgainButton = document.getElementById("business-start-again");
  var fields = form.querySelectorAll("input, select, textarea");

  function clearFields() {
    Array.prototype.forEach.call(fields, function (field) { field.value = ""; });
  }
  function showForm() {
    result.hidden = true;
    form.hidden = false;
    document.getElementById("buyer-name").focus();
  }
  function validFields() {
    for (var n = 0; n < fields.length; n++) {
      if (!fields[n].checkValidity()) {
        fields[n].reportValidity();
        fields[n].focus();
        return false;
      }
    }
    return true;
  }
  if (sampleButton) sampleButton.addEventListener("click", function () {
    var sample = {
      "buyer-name": "Example Buyer",
      "business-name": "Example Kitchen",
      "business-email": "buyer@example.com",
      "business-type": "restaurant",
      "business-area": "Kuala Lumpur",
      "seafood-interest": "Whole fish for shared mains",
      "business-quantity": "20 kg per order",
      "business-frequency": "weekly",
      "business-message": "Interested in confirmed species, preparation and delivery terms when available."
    };
    Object.keys(sample).forEach(function (id) {
      var field = document.getElementById(id);
      if (field) field.value = sample[id];
    });
    if (!result.hidden) showForm();
    document.getElementById("buyer-name").focus();
  });
  if (previewButton) previewButton.addEventListener("click", function () {
    if (!validFields()) return;
    clearFields();
    form.hidden = true;
    result.hidden = false;
    result.focus();
  });
  if (startAgainButton) startAgainButton.addEventListener("click", showForm);
})();
