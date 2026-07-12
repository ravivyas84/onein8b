#!/usr/bin/env node
// Question-bank validator (dev-only, not shipped with the site).
// Usage: node tools/validate.mjs
//
// Loads every data/*.js file the same way the browser does (plain scripts
// appending to globalThis.QUESTIONS) and checks structure, sanity and the
// information budget needed for the quiz to be able to reach "one in 8 billion".

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { createContext, runInContext } from "node:vm";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const TARGETS = {
  calendar: 120, demographics: 80, body: 100, health: 60, family: 60,
  home: 60, food: 80, habits: 80, tech: 80, travel: 80,
  skills: 60, work: 60, beliefs: 40, names: 40,
};
const CONFIDENCES = new Set(["high", "medium", "low"]);
const P_MIN = 0.001, P_MAX = 0.999;
const BITS_NEEDED = Math.log2(8e9); // ≈ 32.9 to get from 8 billion to 1
const TOTAL_BITS_MIN = 3 * BITS_NEEDED; // comfortable margin for replays/skips
const SOLID_BITS_MIN = BITS_NEEDED; // high+medium subset alone must reach 1

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = join(root, "data");

const errors = [];
const warnings = [];

// ---- load the bank exactly like the browser would -------------------------
const sandbox = {};
createContext(sandbox);
const files = existsSync(dataDir)
  ? readdirSync(dataDir).filter((f) => f.endsWith(".js")).sort()
  : [];
for (const f of files) {
  try {
    runInContext(readFileSync(join(dataDir, f), "utf8"), sandbox, { filename: f });
  } catch (e) {
    errors.push(`${f}: failed to execute — ${e.message}`);
  }
}
const questions = Array.isArray(sandbox.QUESTIONS) ? sandbox.QUESTIONS : [];

// ---- per-entry checks ------------------------------------------------------
function sigFigs(x) {
  const mantissa = x.toExponential().split("e")[0].replace("-", "").replace(".", "");
  return mantissa.replace(/0+$/, "").length || 1;
}
const entropy = (p) => (p <= 0 || p >= 1 ? 0 : -(p * Math.log2(p) + (1 - p) * Math.log2(1 - p)));
const worstBits = (p) => Math.min(-Math.log2(p), -Math.log2(1 - p));
const normText = (t) => t.toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ").trim();

const seenIds = new Map();
const seenText = new Map();
for (const q of questions) {
  const where = q?.id ?? JSON.stringify(q)?.slice(0, 60);
  if (!q || typeof q !== "object") { errors.push(`non-object entry: ${where}`); continue; }
  for (const field of ["id", "text", "emoji", "pYes", "category", "confidence", "note"]) {
    if (q[field] === undefined || q[field] === null || q[field] === "") {
      errors.push(`${where}: missing field "${field}"`);
    }
  }
  if (!("group" in q)) errors.push(`${where}: missing field "group" (use null for independent questions)`);
  if (typeof q.id === "string") {
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(q.id)) errors.push(`${where}: id is not kebab-case`);
    if (typeof q.category === "string" && !q.id.startsWith(q.category + "-"))
      errors.push(`${where}: id must start with "${q.category}-"`);
    if (seenIds.has(q.id)) errors.push(`duplicate id: ${q.id}`);
    seenIds.set(q.id, true);
  }
  if (typeof q.category === "string" && !(q.category in TARGETS))
    errors.push(`${where}: unknown category "${q.category}"`);
  if (!CONFIDENCES.has(q.confidence)) errors.push(`${where}: confidence must be high|medium|low`);
  if (q.group !== null && (typeof q.group !== "string" || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(q.group)))
    errors.push(`${where}: group must be null or kebab-case string`);
  if (typeof q.pYes === "number") {
    if (!(q.pYes >= P_MIN && q.pYes <= P_MAX)) errors.push(`${where}: pYes ${q.pYes} outside [${P_MIN}, ${P_MAX}]`);
    if (sigFigs(q.pYes) > 2) errors.push(`${where}: pYes ${q.pYes} has more than 2 significant figures`);
  } else if (q.pYes !== undefined) {
    errors.push(`${where}: pYes must be a number`);
  }
  if (typeof q.text === "string") {
    if (!q.text.endsWith("?")) errors.push(`${where}: text must end with "?"`);
    if (q.text.length > 100) warnings.push(`${where}: text longer than 100 chars`);
    if (!/^[A-Z]/.test(q.text)) warnings.push(`${where}: text should start with a capital letter`);
    const norm = normText(q.text);
    if (seenText.has(norm)) errors.push(`duplicate text: "${q.text}" (${where} vs ${seenText.get(norm)})`);
    seenText.set(norm, q.id);
  }
  if (typeof q.emoji === "string" && q.emoji.length > 0 && ![...q.emoji].some((c) => c.codePointAt(0) > 0x2000))
    warnings.push(`${where}: emoji field doesn't look like an emoji`);
  if (typeof q.note === "string" && q.note.length > 0 && q.note.length < 8)
    warnings.push(`${where}: note is suspiciously short`);
}

// ---- near-duplicate detection (different groups only) ----------------------
const tokenSets = questions
  .filter((q) => typeof q.text === "string")
  .map((q) => ({ id: q.id, group: q.group, set: new Set(normText(q.text).split(" ")) }));
for (let i = 0; i < tokenSets.length; i++) {
  for (let j = i + 1; j < tokenSets.length; j++) {
    const a = tokenSets[i], b = tokenSets[j];
    if (a.group !== null && a.group === b.group) continue; // same-group variants are expected
    let inter = 0;
    for (const t of a.set) if (b.set.has(t)) inter++;
    const jac = inter / (a.set.size + b.set.size - inter);
    if (jac >= 0.8) warnings.push(`near-duplicate texts: ${a.id} ~ ${b.id} (jaccard ${jac.toFixed(2)})`);
  }
}

// ---- category counts --------------------------------------------------------
const counts = {};
for (const q of questions) if (typeof q.category === "string") counts[q.category] = (counts[q.category] || 0) + 1;
console.log("category counts:");
for (const [cat, target] of Object.entries(TARGETS)) {
  const n = counts[cat] || 0;
  const fileExists = files.includes(cat + ".js");
  const status = !fileExists && n === 0 ? "pending" : n === target ? "ok" : "MISMATCH";
  if (status === "MISMATCH") errors.push(`category "${cat}": ${n} questions, target ${target}`);
  console.log(`  ${cat.padEnd(13)} ${String(n).padStart(4)} / ${target}  ${status}`);
}
console.log(`  ${"TOTAL".padEnd(13)} ${String(questions.length).padStart(4)} / 1000`);

// ---- information budget -----------------------------------------------------
// One question per group per run: a group contributes its best member.
function bitsFor(subset) {
  const byGroup = new Map();
  let expected = 0, worst = 0;
  for (const q of subset) {
    if (typeof q.pYes !== "number") continue;
    if (q.group === null || q.group === undefined) {
      expected += entropy(q.pYes);
      worst += worstBits(q.pYes);
    } else {
      const cur = byGroup.get(q.group) || { e: 0, w: 0 };
      cur.e = Math.max(cur.e, entropy(q.pYes));
      cur.w = Math.max(cur.w, worstBits(q.pYes));
      byGroup.set(q.group, cur);
    }
  }
  for (const { e, w } of byGroup.values()) { expected += e; worst += w; }
  return { expected, worst, groups: byGroup.size };
}
const all = bitsFor(questions);
const solid = bitsFor(questions.filter((q) => q.confidence === "high" || q.confidence === "medium"));
const high = bitsFor(questions.filter((q) => q.confidence === "high"));
const nullCount = questions.filter((q) => q.group === null).length;
console.log("\ninformation budget (bits; 8e9 → 1 needs ≈ %s):", BITS_NEEDED.toFixed(1));
console.log(`  whole bank:    expected ${all.expected.toFixed(1)}, worst-case ${all.worst.toFixed(1)} (${all.groups} groups + ${nullCount} independent)`);
console.log(`  high+medium:   expected ${solid.expected.toFixed(1)}, worst-case ${solid.worst.toFixed(1)}`);
console.log(`  high only:     expected ${high.expected.toFixed(1)}, worst-case ${high.worst.toFixed(1)}`);
if (questions.length === 1000) {
  if (all.expected < TOTAL_BITS_MIN) errors.push(`whole-bank expected bits ${all.expected.toFixed(1)} below ${TOTAL_BITS_MIN.toFixed(0)}`);
  if (solid.expected < SOLID_BITS_MIN) errors.push(`high+medium expected bits ${solid.expected.toFixed(1)} below ${SOLID_BITS_MIN.toFixed(1)}`);
}

// ---- report -----------------------------------------------------------------
if (warnings.length) {
  console.log(`\n${warnings.length} warning(s):`);
  for (const w of warnings) console.log("  ⚠ " + w);
}
if (errors.length) {
  console.log(`\n${errors.length} error(s):`);
  for (const e of errors) console.log("  ✘ " + e);
  process.exit(1);
}
console.log("\n✔ bank is valid");
