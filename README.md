# One in 8 Billion

A playful quiz: answer yes/no questions and watch a giant counter shrink from
**8,000,000,000** toward **1**, revealing roughly how many people on Earth are
like you.

Every question carries an estimated share of the world population that would
answer "yes". Answer **yes** and the counter multiplies by that share; answer
**no** and it multiplies by the rest; **skip** and nothing changes. Reach a
small enough number and you're officially (well, playfully) one of a kind.

> **Statistically flavored entertainment, not a census.** The math treats every
> answer as independent, which real life is not, and many percentages are
> estimates. That's the fun, not the flaw.

## The question bank

The bank lives in [`data/`](data/) as plain JS files — no build step. Each file
appends to a global `QUESTIONS` array:

```js
{
  id: "body-left-handed",          // kebab-case, prefixed with its category
  emoji: "🖐️",
  text: "Are you left-handed?",
  pYes: 0.10,                       // estimated share of ALL people answering yes
  category: "body",
  confidence: "high",               // high | medium | low (see below)
  group: "handedness",              // correlation group, or null if independent
  note: "≈10% globally (Papadatou-Pastou 2020 meta-analysis)"
}
```

**1,000 questions** across 14 categories:

| File | Category | Count |
|---|---|---|
| `data/calendar.js` | Birthday & calendar math | 120 |
| `data/body.js` | Body & appearance | 100 |
| `data/demographics.js` | Demographics & geography | 80 |
| `data/food.js` | Food & drink | 80 |
| `data/habits.js` | Habits & lifestyle | 80 |
| `data/tech.js` | Technology & digital life | 80 |
| `data/travel.js` | Travel & experiences | 80 |
| `data/health.js` | Health & senses | 60 |
| `data/family.js` | Family & relationships | 60 |
| `data/home.js` | Home & living | 60 |
| `data/skills.js` | Skills & abilities | 60 |
| `data/work.js` | Work & education | 60 |
| `data/beliefs.js` | Preferences & beliefs | 40 |
| `data/names.js` | Names & letters | 40 |

### Correlation groups

The quiz multiplies probabilities as if answers were independent — so asking
"Were you born in January?" *and* "Were you born in the first quarter?" would
double-count the same fact and corrupt the number. Questions that overlap share
a `group` (e.g. every month, zodiac and birthstone question is in
`birth-month`), and **the quiz asks at most one question per group per
playthrough**. Groups also span files: the birth-decade questions in
`calendar.js` share `age-band` with the "Are you under 30?" questions in
`demographics.js`.

Grouping polices *strong* overlap (same underlying fact). Mild real-world
correlations (height↔sex, snow↔latitude…) are accepted as part of the game —
see the disclaimer above.

### About the numbers

There are nowhere near 1,000 rigorously measured global statistics, so every
entry is labeled:

- **`high`** — hard data or pure math: UN/World Bank/OWID demographics,
  well-replicated science (handedness, twins, colorblindness), and calendar
  questions that are exact by construction ("born on an odd day" ≈ 51%).
- **`medium`** — global surveys and industry reports (GSMA, WHO, Pew, ITU,
  ILO…), conservatively adjusted when a stat covers only adults or only some
  countries. The adjustment is written into the `note`.
- **`low`** — defensible order-of-magnitude estimates for experiences and
  preferences ("have you broken a bone?"). Fun long-tail material; the quiz
  engine deprioritizes these while the number is still huge.

Every entry's `note` records its source or reasoning, so any figure you
disagree with is a one-line edit. Percentages are rounded to two significant
figures — more precision would be dishonest.

### Validating

```sh
node tools/validate.mjs
```

Checks ids, fields, probability bounds, duplicate/near-duplicate texts,
per-category counts, and prints the information budget — the bank must carry
far more than the ≈33 bits needed to cut 8 billion down to 1, and the
high+medium subset must reach 1 on its own. Run it after any edit to `data/`.

### Adding a question

1. Pick the right `data/*.js` file and append an entry (id prefixed with the
   category, `pYes` as a share of *all* people, honest `confidence` + `note`).
2. If it overlaps an existing question, give both the same `group`.
3. Adjust that category's target in `tools/validate.mjs` (`TARGETS`) and run
   the validator.

## Site (stage 2)

The quiz itself — a zero-dependency static page (`index.html` + `styles.css` +
`app.js`) with an animated counter, adaptive question selection, journey recap
and share button — deploys on **Netlify or Vercel** with no configuration:
connect the repo, framework preset "none", publish directory `/` (root).
