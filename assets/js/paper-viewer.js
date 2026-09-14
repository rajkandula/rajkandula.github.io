/*
 * Inline PDF viewer for papers, drawn with PDF.js (loaded from cdnjs on first use).
 *
 *   <div class="pdfv" data-pdf="/files/paper.pdf"></div>
 *
 * The viewer builds itself when it scrolls into view (or when a hidden preview
 * is opened), renders only the pages near the viewport, and re-renders sharply
 * on zoom, resize and full screen.
 */
(function () {
  var PDFJS = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/";
  var ZOOMS = [0.5, 0.75, 1, 1.25, 1.5, 2, 2.5];
  var RENDER_MARGIN = 800;
  var pdfjsPromise = null;

  function loadPdfJs() {
    if (!pdfjsPromise) {
      pdfjsPromise = new Promise(function (resolve, reject) {
        var script = document.createElement("script");
        script.src = PDFJS + "pdf.min.js";
        script.onload = function () {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS + "pdf.worker.min.js";
          resolve(window.pdfjsLib);
        };
        script.onerror = function () {
          pdfjsPromise = null;
          reject(new Error("PDF.js failed to load"));
        };
        document.head.appendChild(script);
      });
    }
    return pdfjsPromise;
  }

  function icon(paths) {
    return '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + paths + "</svg>";
  }

  var ICON = {
    up: icon('<path d="m18 15-6-6-6 6"/>'),
    down: icon('<path d="m6 9 6 6 6-6"/>'),
    minus: icon('<path d="M5 12h14"/>'),
    plus: icon('<path d="M12 5v14M5 12h14"/>'),
    fit: icon('<path d="M21 12H3M7 8l-4 4 4 4M17 8l4 4-4 4"/>'),
    expand: icon('<path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3"/>'),
    shrink: icon('<path d="M8 3v3a2 2 0 0 1-2 2H3M21 8h-3a2 2 0 0 1-2-2V3M3 16h3a2 2 0 0 1 2 2v3M16 21v-3a2 2 0 0 1 2-2h3"/>'),
    download: icon('<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>')
  };

  function button(action, label, svg) {
    return '<button type="button" class="pdfv__btn" data-act="' + action + '" aria-label="' + label + '" title="' + label + '">' + svg + "</button>";
  }

  function Viewer(root) {
    this.root = root;
    this.url = root.getAttribute("data-pdf");
    this.zoom = 1; // multiplier on "fit to width"
    this.generation = 0; // bumps on every re-layout so stale renders are dropped
    this.current = 1;
    this.sheets = [];
    this.build();
    this.load();
  }

  Viewer.prototype.build = function () {
    var self = this;
    var canFullscreen = Boolean(this.root.requestFullscreen);

    this.root.innerHTML =
      '<div class="pdfv__bar">' +
        '<div class="pdfv__group">' +
          button("prev", "Previous page", ICON.up) +
          '<label class="pdfv__pages"><input class="pdfv__page" type="text" inputmode="numeric" value="1" aria-label="Current page"> of <b data-total>–</b></label>' +
          button("next", "Next page", ICON.down) +
        "</div>" +
        '<div class="pdfv__group">' +
          button("zoom-out", "Zoom out", ICON.minus) +
          '<span class="pdfv__zoom" data-zoom>Fit</span>' +
          button("zoom-in", "Zoom in", ICON.plus) +
          button("fit", "Fit to width", ICON.fit) +
        "</div>" +
        '<div class="pdfv__group">' +
          (canFullscreen ? button("fullscreen", "Full screen", ICON.expand) : "") +
          '<a class="pdfv__btn" href="' + this.url + '" download aria-label="Download PDF" title="Download PDF">' + ICON.download + "</a>" +
        "</div>" +
      "</div>" +
      '<div class="pdfv__stage" tabindex="0"><p class="pdfv__status">Loading paper…</p></div>';

    this.stage = this.root.querySelector(".pdfv__stage");
    this.pageInput = this.root.querySelector(".pdfv__page");
    this.total = this.root.querySelector("[data-total]");
    this.zoomLabel = this.root.querySelector("[data-zoom]");
    this.prevButton = this.root.querySelector('[data-act="prev"]');
    this.nextButton = this.root.querySelector('[data-act="next"]');
    this.fullscreenButton = this.root.querySelector('[data-act="fullscreen"]');

    this.root.querySelector(".pdfv__bar").addEventListener("click", function (event) {
      var target = event.target.closest("[data-act]");
      if (!target) return;
      var action = target.getAttribute("data-act");
      if (action === "prev") self.goTo(self.current - 1);
      else if (action === "next") self.goTo(self.current + 1);
      else if (action === "zoom-in") self.stepZoom(1);
      else if (action === "zoom-out") self.stepZoom(-1);
      else if (action === "fit") self.setZoom(1);
      else if (action === "fullscreen") self.toggleFullscreen();
    });

    this.pageInput.addEventListener("change", function () {
      self.goTo(parseInt(self.pageInput.value, 10));
    });
    this.pageInput.addEventListener("keydown", function (event) {
      if (event.key === "Enter") self.pageInput.blur();
    });

    this.stage.addEventListener("scroll", function () {
      if (self.ticking) return;
      self.ticking = true;
      requestAnimationFrame(function () {
        self.ticking = false;
        self.onScroll();
      });
    });

    document.addEventListener("fullscreenchange", function () {
      if (self.fullscreenButton) {
        var on = document.fullscreenElement === self.root;
        self.fullscreenButton.innerHTML = on ? ICON.shrink : ICON.expand;
        self.fullscreenButton.setAttribute("aria-label", on ? "Exit full screen" : "Full screen");
      }
    });

    if (window.ResizeObserver) {
      new ResizeObserver(function () {
        var width = self.stage.clientWidth;
        if (width && width !== self.width) self.layout();
      }).observe(this.stage);
    }
  };

  Viewer.prototype.load = function () {
    var self = this;
    loadPdfJs()
      .then(function (pdfjs) {
        return pdfjs.getDocument(self.url).promise;
      })
      .then(function (pdf) {
        var jobs = [];
        for (var i = 1; i <= pdf.numPages; i++) jobs.push(pdf.getPage(i));
        return Promise.all(jobs);
      })
      .then(function (pages) {
        self.pages = pages;
        self.total.textContent = pages.length;
        self.stage.innerHTML = "";
        self.sheets = pages.map(function (page, i) {
          var sheet = document.createElement("div");
          sheet.className = "pdfv__sheet";
          sheet.setAttribute("data-page", i + 1);
          self.stage.appendChild(sheet);
          return sheet;
        });
        self.layout();
        self.setCurrent(1);
      })
      .catch(function () {
        self.stage.innerHTML = '<p class="pdfv__status">Couldn’t load the preview. <a href="' + self.url + '">Open the PDF</a> instead.</p>';
      });
  };

  Viewer.prototype.layout = function () {
    if (!this.pages) return;
    var width = this.stage.clientWidth;
    if (!width) return;

    var anchor = this.stage.scrollHeight ? this.stage.scrollTop / this.stage.scrollHeight : 0;
    var padding = parseFloat(getComputedStyle(this.stage).paddingLeft) * 2;
    var base = this.pages[0].getViewport({ scale: 1 });
    var self = this;

    this.width = width;
    this.generation += 1;
    this.scale = (Math.max(width - padding, 160) / base.width) * this.zoom;

    this.pages.forEach(function (page, i) {
      var viewport = page.getViewport({ scale: self.scale });
      self.sheets[i].style.width = Math.floor(viewport.width) + "px";
      self.sheets[i].style.height = Math.floor(viewport.height) + "px";
    });

    this.stage.scrollTop = anchor * this.stage.scrollHeight;
    this.zoomLabel.textContent = this.zoom === 1 ? "Fit" : Math.round(this.zoom * 100) + "%";
    this.drawVisible();
  };

  Viewer.prototype.drawVisible = function () {
    var top = this.stage.scrollTop - RENDER_MARGIN;
    var bottom = this.stage.scrollTop + this.stage.clientHeight + RENDER_MARGIN;
    var self = this;
    this.sheets.forEach(function (sheet) {
      var sheetTop = sheet.offsetTop;
      if (sheetTop + sheet.offsetHeight >= top && sheetTop <= bottom) self.draw(sheet);
    });
  };

  Viewer.prototype.draw = function (sheet) {
    var generation = this.generation;
    if (sheet.pdfvGeneration === generation) return;
    sheet.pdfvGeneration = generation;

    var page = this.pages[Number(sheet.getAttribute("data-page")) - 1];
    var ratio = Math.min(window.devicePixelRatio || 1, 2);
    var viewport = page.getViewport({ scale: this.scale * ratio });
    var canvas = document.createElement("canvas");
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);

    if (sheet.pdfvTask) sheet.pdfvTask.cancel();
    var task = page.render({ canvasContext: canvas.getContext("2d"), viewport: viewport });
    sheet.pdfvTask = task;

    // Paint off-screen, then swap, so zooming never flashes a blank page.
    task.promise
      .then(function () {
        if (sheet.pdfvGeneration !== generation) return;
        sheet.replaceChildren(canvas);
        sheet.classList.add("is-ready");
      })
      .catch(function () { /* cancelled by a newer render */ });
  };

  Viewer.prototype.onScroll = function () {
    this.drawVisible();
    var mark = this.stage.scrollTop + this.stage.clientHeight / 3;
    var current = 1;
    this.sheets.forEach(function (sheet, i) {
      if (sheet.offsetTop <= mark) current = i + 1;
    });
    this.setCurrent(current);
  };

  Viewer.prototype.setCurrent = function (n) {
    this.current = n;
    if (document.activeElement !== this.pageInput) this.pageInput.value = n;
    this.prevButton.disabled = n <= 1;
    this.nextButton.disabled = n >= this.sheets.length;
  };

  Viewer.prototype.goTo = function (n) {
    if (!this.sheets.length || isNaN(n)) {
      this.pageInput.value = this.current;
      return;
    }
    n = Math.max(1, Math.min(this.sheets.length, n));
    this.stage.scrollTo({ top: this.sheets[n - 1].offsetTop - 16, behavior: "smooth" });
    this.setCurrent(n);
  };

  Viewer.prototype.stepZoom = function (direction) {
    var i = ZOOMS.indexOf(this.zoom);
    this.setZoom(ZOOMS[Math.max(0, Math.min(ZOOMS.length - 1, i + direction))]);
  };

  Viewer.prototype.setZoom = function (zoom) {
    if (zoom === this.zoom) return;
    this.zoom = zoom;
    this.layout();
  };

  Viewer.prototype.toggleFullscreen = function () {
    if (document.fullscreenElement) document.exitFullscreen();
    else this.root.requestFullscreen();
  };

  function start(root) {
    if (!root.pdfvViewer) root.pdfvViewer = new Viewer(root);
  }

  var roots = document.querySelectorAll(".pdfv[data-pdf]");
  if (!("IntersectionObserver" in window)) {
    roots.forEach(start);
    return;
  }
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      start(entry.target);
    });
  }, { rootMargin: "300px" });
  roots.forEach(function (root) { observer.observe(root); });
})();
