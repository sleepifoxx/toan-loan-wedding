(function () {
  "use strict";

  /* ---------- Envelope open ---------- */
  var envelope = document.getElementById("envelope-screen");
  var openBtn = document.getElementById("open-btn");
  var site = document.getElementById("site");

  function openInvitation() {
    envelope.classList.add("closing");
    site.classList.remove("hidden");
    document.body.style.overflow = "";
    setTimeout(function () {
      envelope.style.display = "none";
      revealOnScroll();
    }, 900);
  }

  document.body.style.overflow = "hidden";
  openBtn.addEventListener("click", openInvitation);

  /* ---------- Falling petals ---------- */
  var petalLayer = document.getElementById("petals");
  var PETAL_CHARS = ["❀", "❁", "✿"];
  function spawnPetal() {
    var el = document.createElement("span");
    el.className = "petal";
    el.textContent = PETAL_CHARS[Math.floor(Math.random() * PETAL_CHARS.length)];
    var left = Math.random() * 100;
    var duration = 8 + Math.random() * 8;
    var size = 12 + Math.random() * 12;
    var drift = (Math.random() - 0.5) * 120;
    el.style.left = left + "vw";
    el.style.fontSize = size + "px";
    el.style.animationDuration = duration + "s";
    el.style.setProperty("--drift", drift + "px");
    petalLayer.appendChild(el);
    setTimeout(function () { el.remove(); }, duration * 1000 + 200);
  }
  for (var i = 0; i < 6; i++) setTimeout(spawnPetal, i * 900);
  setInterval(spawnPetal, 1600);

  /* ---------- Reveal on scroll ---------- */
  var revealTargets = document.querySelectorAll(".reveal");
  var io = ("IntersectionObserver" in window)
    ? new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" })
    : null;

  function revealOnScroll() {
    if (!io) {
      revealTargets.forEach(function (t) { t.classList.add("in"); });
      return;
    }
    revealTargets.forEach(function (t) { io.observe(t); });
  }

  /* ---------- Countdown ---------- */
  var target = new Date("2026-09-19T16:30:00+07:00").getTime();
  var elDays = document.getElementById("cd-days");
  var elHours = document.getElementById("cd-hours");
  var elMins = document.getElementById("cd-mins");
  var elSecs = document.getElementById("cd-secs");

  function pad(n) { return String(n).padStart(2, "0"); }

  function tickCountdown() {
    var diff = target - Date.now();
    if (diff < 0) diff = 0;
    var days = Math.floor(diff / 86400000);
    var hours = Math.floor((diff % 86400000) / 3600000);
    var mins = Math.floor((diff % 3600000) / 60000);
    var secs = Math.floor((diff % 60000) / 1000);
    elDays.textContent = pad(days);
    elHours.textContent = pad(hours);
    elMins.textContent = pad(mins);
    elSecs.textContent = pad(secs);
  }
  tickCountdown();
  setInterval(tickCountdown, 1000);

  /* ---------- Gallery lightbox ---------- */
  var lightbox = document.createElement("div");
  lightbox.id = "lightbox";
  lightbox.innerHTML = '<button id="lightbox-close" aria-label="Đóng">&times;</button><img alt="Ảnh cưới phóng to">';
  document.body.appendChild(lightbox);
  var lightboxImg = lightbox.querySelector("img");
  var lightboxClose = document.getElementById("lightbox-close");

  document.querySelectorAll(".g-item img").forEach(function (img) {
    img.addEventListener("click", function () {
      lightboxImg.src = img.src;
      lightbox.classList.add("open");
    });
  });
  function closeLightbox() { lightbox.classList.remove("open"); }
  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeLightbox();
  });

  /* ---------- Gift tabs ---------- */
  var tabs = document.querySelectorAll(".gift-tab");
  var panels = document.querySelectorAll(".gift-panel");
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      tabs.forEach(function (t) { t.classList.remove("active"); });
      panels.forEach(function (p) { p.classList.remove("active"); });
      tab.classList.add("active");
      document.getElementById(tab.dataset.target).classList.add("active");
    });
  });

  /* fallback: reveal immediately if envelope already bypassed */
  if (!site.classList.contains("hidden")) revealOnScroll();
})();
