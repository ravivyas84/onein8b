// One in 8 Billion — quiz engine.
// State machine over three screens; multiplies a running population count by
// each answer's probability. One question per correlation group per run.
(() => {
  "use strict";

  const WORLD = 8e9;
  const REVEAL_AFTER = 10; // answers before "reveal my result" appears
  const ENDGAME_BELOW = 100000; // switch to precision halvers under this
  const FINISH_BELOW = 1000; // auto-finish under this

  const bank = globalThis.QUESTIONS || [];
  const comparisons = globalThis.COMPARISONS || [];
  const $ = (sel) => document.querySelector(sel);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const numberFmt = new Intl.NumberFormat("en-US");

  // ---------- state ----------
  let n = WORLD;
  let asked = new Set();
  let usedGroups = new Set();
  let history = [];
  let answeredCount = 0;
  let current = null;
  let shuffled = [];
  let busy = false;

  // ---------- math & formatting ----------
  const entropy = (p) => -(p * Math.log2(p) + (1 - p) * Math.log2(1 - p));

  function displayValue(x) {
    x = Math.max(1, x);
    if (x >= 10000) {
      const mag = Math.floor(Math.log10(x));
      const step = 10 ** (mag - 2);
      return Math.round(x / step) * step;
    }
    return Math.round(x);
  }
  const fmt = (x) => numberFmt.format(displayValue(x));

  // ---------- counter animation ----------
  let raf = null;
  function setCounter(value) {
    $("#counter").textContent = fmt(value);
  }
  function animateCounter(from, to, done) {
    if (raf) cancelAnimationFrame(raf);
    if (reduceMotion || from === to) {
      setCounter(to);
      if (done) done();
      return;
    }
    const t0 = performance.now();
    const DUR = 900;
    const ease = (t) => 1 - (1 - t) ** 3;
    const tick = (now) => {
      const t = Math.min(1, (now - t0) / DUR);
      setCounter(from + (to - from) * ease(t));
      if (t < 1) raf = requestAnimationFrame(tick);
      else {
        raf = null;
        if (done) done();
      }
    };
    raf = requestAnimationFrame(tick);
  }

  // ---------- question selection ----------
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  const available = () =>
    shuffled.filter((q) => !asked.has(q.id) && (q.group === null || !usedGroups.has(q.group)));

  function pickNext() {
    const pool = available();
    if (!pool.length) return null;
    // Opening: dramatic, trustworthy cuts.
    if (answeredCount < 4) {
      const openers = pool.filter((q) => q.confidence !== "low" && entropy(q.pYes) >= 0.85);
      if (openers.length) return openers[Math.floor(Math.random() * openers.length)];
    }
    // Endgame: high-confidence near-halvers guarantee progress toward 1.
    if (n < ENDGAME_BELOW) {
      const cutters = pool.filter((q) => q.confidence === "high" && entropy(q.pYes) >= 0.8);
      if (cutters.length) return cutters[Math.floor(Math.random() * cutters.length)];
    }
    // Midgame: weighted random, favoring better-sourced questions.
    const weight = { high: 3, medium: 2, low: 1 };
    let total = 0;
    for (const q of pool) total += weight[q.confidence];
    let r = Math.random() * total;
    for (const q of pool) {
      r -= weight[q.confidence];
      if (r <= 0) return q;
    }
    return pool[pool.length - 1];
  }

  // ---------- screens ----------
  function show(id) {
    for (const s of document.querySelectorAll("main > section")) s.hidden = s.id !== id;
  }

  function showQuestion(q) {
    current = q;
    const card = $("#question-card");
    card.dataset.qid = q.id;
    $("#q-emoji").textContent = q.emoji;
    $("#q-text").textContent = q.text;
    $("#q-count").textContent = `question ${answeredCount + 1} · you started as one of 8,000,000,000`;
    $("#reveal").hidden = answeredCount < REVEAL_AFTER;
    card.classList.remove("pop");
    void card.offsetWidth; // restart animation
    card.classList.add("pop");
    busy = false;
  }

  function next() {
    const q = pickNext();
    if (!q) return finish();
    showQuestion(q);
  }

  function answer(kind) {
    if (busy || !current) return;
    const q = current;
    if (kind === "skip") {
      asked.add(q.id); // question discarded; its group stays available
      next();
      return;
    }
    busy = true;
    const before = n;
    n = n * (kind === "yes" ? q.pYes : 1 - q.pYes);
    asked.add(q.id);
    if (q.group !== null) usedGroups.add(q.group);
    history.push({ q, kind, before, after: n });
    answeredCount++;
    animateCounter(before, n, () => {
      if (n <= 1) finish();
      else if (n < FINISH_BELOW) finish();
      else next();
    });
  }

  // ---------- results ----------
  function comparisonFor(x) {
    for (const c of comparisons) if (x >= c.min) return c.text;
    return "just you";
  }

  function finish() {
    const golden = n <= 1;
    const oneInX = fmt(WORLD / Math.max(1, n));
    document.body.classList.toggle("golden", golden);
    if (golden) {
      $("#result-headline").textContent = "You are literally one in 8 billion.";
      $("#result-subline").textContent = "Nobody else on Earth matches your answers. One of a kind.";
    } else if (n < FINISH_BELOW) {
      $("#result-headline").innerHTML = `You are one in <strong>${oneInX}</strong>.`;
      $("#result-subline").textContent =
        `Fewer than a thousand people on Earth are like you — roughly ${fmt(n)}.`;
    } else {
      $("#result-headline").innerHTML = `You are one in <strong>${oneInX}</strong>.`;
      $("#result-subline").textContent = `≈ ${fmt(n)} people on Earth are like you.`;
    }
    $("#result-comparison").textContent = golden ? "That's rarer than rare. Take a bow." : `That's roughly ${comparisonFor(n)}.`;
    $("#result-count").textContent = `${answeredCount} questions answered`;

    const list = $("#journey");
    list.innerHTML = "";
    for (const h of history) {
      const li = document.createElement("li");
      const ans = h.kind === "yes" ? "Yes" : "No";
      li.innerHTML =
        `<span class="j-emoji">${h.q.emoji}</span>` +
        `<span class="j-text">${h.q.text} <em>${ans}</em></span>` +
        `<span class="j-nums">${fmt(h.before)} → ${fmt(h.after)}</span>`;
      list.appendChild(li);
    }
    show("results");
  }

  // ---------- sharing ----------
  function shareText() {
    const oneInX = fmt(WORLD / Math.max(1, n));
    return n <= 1
      ? `I'm literally one in 8 billion 🌍 How rare are you? ${location.href}`
      : `I'm one in ${oneInX} 🌍 Only ~${fmt(n)} people on Earth are like me. How rare are you? ${location.href}`;
  }
  async function share() {
    const text = shareText();
    if (navigator.share) {
      try {
        await navigator.share({ title: "One in 8 Billion", text });
        return;
      } catch { /* fall through to clipboard on cancel/error */ }
    }
    try {
      await navigator.clipboard.writeText(text);
      flashShare("Copied!");
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      flashShare("Copied!");
    }
  }
  function flashShare(msg) {
    const btn = $("#share");
    const old = btn.textContent;
    btn.textContent = msg;
    setTimeout(() => (btn.textContent = old), 1600);
  }

  // ---------- lifecycle ----------
  function start() {
    n = WORLD;
    asked = new Set();
    usedGroups = new Set();
    history = [];
    answeredCount = 0;
    busy = false;
    document.body.classList.remove("golden");
    shuffled = shuffle(bank);
    setCounter(WORLD);
    show("quiz");
    next();
  }

  // ---------- wire up ----------
  $("#start").addEventListener("click", start);
  $("#play-again").addEventListener("click", start);
  $("#yes").addEventListener("click", () => answer("yes"));
  $("#no").addEventListener("click", () => answer("no"));
  $("#skip").addEventListener("click", () => answer("skip"));
  $("#reveal").addEventListener("click", () => finish());
  $("#share").addEventListener("click", share);
  document.addEventListener("keydown", (e) => {
    if ($("#quiz").hidden || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === "y" || e.key === "Y") answer("yes");
    else if (e.key === "n" || e.key === "N") answer("no");
    else if (e.key === "s" || e.key === "S") answer("skip");
  });

  $("#start-counter").textContent = numberFmt.format(WORLD);
  show("start-screen");
})();
