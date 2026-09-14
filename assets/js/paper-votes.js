/*
 * Paper likes and preview toggle.
 *
 * Counts live in Abacus (https://abacus.jasoncameron.dev), a free public
 * counter with CORS enabled — no backend needed on GitHub Pages. Each browser
 * gets one like per paper, remembered in localStorage.
 */
(function () {
  var API = "https://abacus.jasoncameron.dev";
  var NAMESPACE = "rajkandula-github-io";
  var THANKS = "Thanks for the like!";

  function counterUrl(action, paper, kind) {
    return API + "/" + action + "/" + NAMESPACE + "/" + paper + "-" + kind;
  }

  function readVote(paper) {
    try { return localStorage.getItem("paper-vote:" + paper); } catch (e) { return null; }
  }

  function saveVote(paper, kind) {
    try { localStorage.setItem("paper-vote:" + paper, kind); } catch (e) { /* private mode */ }
  }

  function loadCount(paper, kind, out) {
    fetch(counterUrl("get", paper, kind))
      .then(function (res) { return res.ok ? res.json() : { value: 0 }; })
      .then(function (data) { out.textContent = data.value || 0; })
      .catch(function () { out.textContent = "–"; });
  }

  document.querySelectorAll("[data-votes]").forEach(function (box) {
    var paper = box.getAttribute("data-votes");
    var readonly = box.hasAttribute("data-readonly");
    var options = box.querySelectorAll("[data-kind]");
    var status = box.querySelector("[data-vote-status]");
    var mine = readVote(paper);

    if (mine && status) status.textContent = THANKS;

    options.forEach(function (option) {
      var kind = option.getAttribute("data-kind");
      var out = option.querySelector("[data-count]");
      loadCount(paper, kind, out);
      if (mine === kind) option.classList.add("is-mine");
      if (readonly) return;
      if (mine) option.disabled = true;

      option.addEventListener("click", function () {
        if (readVote(paper)) return;
        saveVote(paper, kind);
        option.classList.add("is-mine");
        options.forEach(function (o) { o.disabled = true; });
        if (status) status.textContent = THANKS;
        out.textContent = (parseInt(out.textContent, 10) || 0) + 1;

        fetch(counterUrl("hit", paper, kind))
          .then(function (res) { return res.json(); })
          .then(function (data) { if (typeof data.value === "number") out.textContent = data.value; })
          .catch(function () { /* keep the optimistic count */ });
      });
    });
  });

  document.querySelectorAll("[data-preview-toggle]").forEach(function (button) {
    var panel = document.getElementById(button.getAttribute("data-preview-toggle"));
    if (!panel) return;
    var frame = panel.querySelector("iframe");
    var label = button.querySelector("[data-label]");

    button.addEventListener("click", function () {
      var opening = panel.hidden;
      if (opening && frame && !frame.getAttribute("src")) frame.src = panel.getAttribute("data-src");
      panel.hidden = !opening;
      button.setAttribute("aria-expanded", String(opening));
      if (label) label.textContent = opening ? "Hide preview" : "Preview paper";
    });
  });
})();
