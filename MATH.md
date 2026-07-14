# The math behind One in 8 Billion

## The model in one line

Start with everyone: $N_0 = 8{,}000{,}000{,}000$. Every yes/no question $i$ has
a probability $p_i$ — our estimate of the share of **all people on Earth** who
would answer "yes". After each answer, the count of "people like you" is
multiplied by the share who answered the same way:

$$
N_{i} = N_{i-1} \times f_i,\qquad
f_i = \begin{cases}
p_i & \text{you answered yes}\\
1-p_i & \text{you answered no}\\
1 & \text{you skipped}
\end{cases}
$$

Your final number is $N = 8\times10^9 \cdot \prod_i f_i$, and the headline is
its reciprocal share: **you are one in** $8\times10^9 / N$.

That's the whole engine. Everything else — correlation groups, question
ordering, the endgame — exists to keep that product honest and fun.

## Why multiplication?

The count of people matching *all* your answers is a joint probability:

$$
N = 8\times10^9 \cdot P(A_1 \cap A_2 \cap \dots \cap A_k)
$$

Joint probabilities only factor into a simple product,
$P(A_1)\cdot P(A_2)\cdots$, when the traits are **independent** — knowing one
answer tells you nothing about another. Real human traits are not fully
independent, which is why the site's footer calls itself *statistically
flavored entertainment, not a census*. But for unrelated traits (left-handed ×
drinks tea × born on a Tuesday) independence is a decent approximation, and
the game embraces it.

## A real playthrough

This run happened during automated testing — 13 answers, each row one
multiplication:

| Question | Answer | Factor | People like you |
|---|---|---:|---:|
| — | — | — | 8,000,000,000 |
| Do you use Facebook? (p=0.38) | No | ×0.62 | 4,960,000,000 |
| Check your phone within minutes of waking? (p=0.50) | Yes | ×0.50 | 2,480,000,000 |
| Video call at least weekly? (p=0.40) | Yes | ×0.40 | 992,000,000 |
| Live in a city or town? (p=0.57) | Yes | ×0.57 | 565,000,000 |
| Use coupons or discount codes? (p=0.15) | Yes | ×0.15 | 84,800,000 |
| Live in the tropics? (p=0.40) | No | ×0.60 | 50,900,000 |
| More than 1,000 photos on your phone? (p=0.35) | No | ×0.65 | 33,100,000 |
| Is your birthstone the emerald (May)? (p=0.085) | Yes | ×0.085 | 2,810,000 |
| Commute longer than 30 minutes? (p=0.25) | No | ×0.75 | 2,110,000 |
| Is your blood type AB? (p=0.055) | No | ×0.945 | 1,990,000 |
| Ever got detention? (p=0.25) | Yes | ×0.25 | 498,000 |
| Are your eyes gray? (p=0.005) | Yes | ×0.005 | 2,491 |
| Born on a weekend? (p=0.29) | Yes | ×0.29 | 722 |

722 < 1,000, so the quiz ends: *"You are one in 11,100,000 — fewer than a
thousand people on Earth are like you."*

Notice the two kinds of moves: **near-50/50 questions** always cut hard
whichever way you answer, while **rare-trait questions** are lottery tickets —
"No" to gray eyes barely moves you (×0.995), but "Yes" divides your group by
200 in one stroke.

## Bits: how far each answer takes you

Information theory makes "how hard did that answer cut" precise. An answer
with factor $f$ contributes $-\log_2 f$ **bits**. To go from 8 billion all the
way to 1 you need

$$
\log_2(8\times10^9) \approx 32.9 \text{ bits.}
$$

A perfect 50/50 question yields exactly 1 bit either way — so ~33 ideal
halvings finish the job. For a question with probability $p$, the *expected*
bits (if your answers are distributed like the world's) is the binary entropy

$$
H(p) = -p\log_2 p - (1-p)\log_2(1-p),
$$

which peaks at $H(0.5)=1$ and collapses for lopsided questions:
"Are you left-handed?" has $H(0.10) \approx 0.47$ bits — because nine times out
of ten the answer is "no", worth a mere $-\log_2 0.9 \approx 0.15$ bits.

This asymmetry drives the design: someone with common traits shrinks slowly
through rare-trait questions, so the engine's endgame leans on **precision
cutters** — calendar questions like "born on an odd-numbered day?" whose
probabilities are exact by construction and near 0.5, guaranteeing ~1 bit per
answer no matter how "average" you are.

The validator (`node tools/validate.mjs`) totals the bank's budget: counting
one question per correlation group, the 1,000 questions hold **≈534 expected
bits** (≈16× the 32.9 needed), and the well-sourced high+medium-confidence
subset alone holds ≈149 — the quiz never needs a shaky estimate to reach 1.

## Correlation groups: where naive multiplication breaks

Multiply two questions about the *same underlying fact* and the model doesn't
bend, it shatters. Take "born in January?" ($p = 1/12$) and "born
January–March?" ($p = 1/4$). Answer yes to both and the product claims

$$
\tfrac{1}{12}\times\tfrac{1}{4} = \tfrac{1}{48}
$$

— but everyone born in January was born in Q1, so the true joint share is just
$1/12$. The product overstates your rarity fourfold, and stacking zodiac,
birthstone and month questions would compound the lie.

Fix: questions that encode the same fact share a `group` (all 55 month-derived
questions are in `birth-month`; birth-decades share `age-band` with the "are
you under 30?" family; geography shares `geo-region`), and **the engine asks at
most one question per group per playthrough**. A skip doesn't burn the group —
only a real answer does.

Groups police *deterministic* overlap only. Softer real-world correlations
(height↔sex, snow↔latitude, smartphone↔internet) survive, and since most
trait pairs correlate positively, the product usually *understates* the true
joint share — i.e. the game systematically flatters your uniqueness a little.
Known, accepted, disclosed.

## How the engine plays its hand

`app.js` orders the deck each run (Fisher–Yates shuffle), then:

1. **Opening (first 4 answers):** only high/medium-confidence questions with
   $H(p) \ge 0.85$ — big trustworthy cuts, so the counter moves dramatically.
2. **Midgame:** weighted random — high-confidence questions 3×, medium 2×,
   low 1× — mixing solid statistics with the fun long tail.
3. **Endgame ($N < 100{,}000$):** high-confidence questions with
   $H(p) \ge 0.8$, mostly calendar cutters, to grind reliably toward 1.

End conditions, checked after every answer: $N \le 1$ (golden ending —
*literally* one in 8 billion), $N < 1{,}000$ (auto-finish), questions
exhausted, or the player taps *reveal my result* (offered after 10 answers).

## Display math

$N$ stays a float internally and is never shown below 1. Above 10,000 it's
rounded to 3 significant figures (743,000,000 rather than a false-precision
742,817,364); below that, whole numbers. The headline "one in X" is
$8\times10^9/N$ under the same rounding.

## Honest limitations

- **Independence is fiction.** Groups remove the fatal cases; mild positive
  correlations remain and generally exaggerate rarity.
- **The $p$ values are estimates.** Each carries a `confidence` tier and a
  source note (see [README](README.md)); low-confidence ones are
  order-of-magnitude calls, rounded to 2 significant figures because more
  would be dishonest.
- **"People" means all 8 billion** — including babies who can't answer a quiz.
  $p$ is the share of humanity with the trait, not the share of likely
  players.
- **The result is a point estimate of a caricature.** It answers "if these
  1,000-ish traits were independent coin flips with these biases, how many
  people would flip exactly your sequence?" — which is precisely as serious as
  it sounds, and that's the point.
