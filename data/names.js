// Names & letters (40). Global first-name statistics barely exist, so this
// category is honestly low-confidence — clearly labeled, instantly answerable.
(() => {
  const C = "names";
  const q = (id, emoji, text, pYes, confidence, group, note) =>
    ({ id: C + "-" + id, emoji, text, pYes, category: C, confidence, group, note });
  globalThis.QUESTIONS = (globalThis.QUESTIONS || []).concat([
    // --- first initial (one per run) ---
    q("starts-with-a", "🅰️", "Does your first name start with A?", 0.1, "low", "name-initial", "A-names (Ali, Amina, Ana, Aarav…) are globally huge; rough estimate"),
    q("starts-with-m", "Ⓜ️", "Does your first name start with M?", 0.1, "low", "name-initial", "Muhammad alone makes M enormous; rough estimate"),
    q("starts-with-s", "💲", "Does your first name start with S?", 0.08, "low", "name-initial", "Rough estimate from name-frequency lists"),
    q("starts-with-j", "🇯", "Does your first name start with J?", 0.06, "low", "name-initial", "Rough estimate from name-frequency lists"),
    q("starts-with-vowel", "🔤", "Does your first name start with a vowel?", 0.22, "low", "name-initial", "Rough estimate from name-frequency lists"),
    q("first-half-alphabet", "⬅️", "Does your first name start with a letter from A to M?", 0.55, "low", "name-initial", "Rough estimate; front-loaded by A and M names"),
    q("second-half-alphabet", "➡️", "Does your first name start with a letter from N to Z?", 0.45, "low", "name-initial", "Rough complement estimate"),
    // --- name length & shape (one per run) ---
    q("short-name", "🤏", "Is your first name four letters or fewer?", 0.25, "low", "name-length", "Rough estimate (as usually written in Latin script)"),
    q("long-name", "📏", "Is your first name eight letters or longer?", 0.2, "low", "name-length", "Rough estimate (as usually written in Latin script)"),
    q("medium-name", "📐", "Is your first name five to seven letters long?", 0.55, "low", "name-length", "Rough estimate (as usually written in Latin script)"),
    q("long-full-name", "📜", "Is your full name longer than 15 letters?", 0.3, "low", "name-length", "Rough global estimate"),
    q("two-syllable-name", "🎵", "Is your first name two syllables?", 0.45, "low", "name-length", "Rough estimate; two syllables dominate many languages"),
    q("three-syllable-name", "🎶", "Is your first name three or more syllables?", 0.35, "low", "name-length", "Rough global estimate"),
    // --- namesakes you've met (one per run) ---
    q("classmate-same-name", "🏫", "Have you ever had a classmate or colleague with your exact first name?", 0.55, "low", "namesakes", "Common names make this likely; rough estimate"),
    q("never-met-namesake", "🦄", "Have you never met anyone with your first name?", 0.15, "low", "namesakes", "The rare-name club; rough estimate"),
    // --- independent ---
    q("double-letter-name", "👯", "Does your first name have a double letter (like Anna or Mohammed)?", 0.3, "low", null, "Rough global estimate"),
    q("name-ends-vowel", "🔚", "Does your first name end in a vowel?", 0.45, "low", null, "Rough estimate; very common in Romance and Indian names"),
    q("name-contains-a", "🔎", "Does your first name contain the letter A anywhere?", 0.6, "low", null, "A is the most common letter in names worldwide; rough estimate"),
    q("has-middle-name", "🪪", "Do you have a middle name?", 0.3, "low", null, "A strong custom in some countries, absent in others"),
    q("top-10-name", "🏆", "Is your first name in your country's all-time top 10?", 0.08, "low", null, "Rough global estimate"),
    q("name-mispronounced", "🗣️", "Do people regularly mispronounce your name?", 0.3, "low", null, "Rough global estimate"),
    q("goes-by-nickname", "✂️", "Do you usually go by a shortened form of your name?", 0.45, "low", null, "Rough global estimate"),
    q("unrelated-nickname", "🎭", "Do you have a nickname totally unrelated to your real name?", 0.25, "low", null, "Rough global estimate"),
    q("different-name-online", "🕶️", "Do you use a different name online than in real life?", 0.3, "low", null, "Rough global estimate"),
    q("knows-name-meaning", "📖", "Do you know what your first name means?", 0.5, "low", null, "Meaningful names are the norm in many cultures; rough estimate"),
    q("initials-spell-word", "🧩", "Do your initials spell a word?", 0.1, "low", null, "Rough global estimate"),
    q("same-initials-parent", "🔗", "Do you share initials with a parent?", 0.15, "low", null, "Rough global estimate"),
    q("common-surname", "👥", "Is your surname one of the most common in your country?", 0.25, "low", null, "Wang, Li, Kumar, Singh, García… megasurnames are common; rough estimate"),
    q("matching-initials", "🪞", "Do your first name and surname start with the same letter?", 0.06, "low", null, "≈1/26 with clustering; rough estimate"),
    q("first-at-roll-call", "1️⃣", "Were you usually first in class roll call?", 0.1, "low", null, "Alphabetical destiny; rough estimate"),
    q("illegible-signature", "🖊️", "Is your signature an illegible scribble?", 0.3, "low", null, "Rough global estimate"),
    q("owns-monogram", "🧵", "Do you own anything monogrammed with your initials?", 0.1, "low", null, "Rough global estimate"),
    q("celebrates-name-day", "🎉", "Do you celebrate a name day?", 0.15, "low", null, "A living tradition in Orthodox and Catholic Europe and beyond"),
    q("unisex-name", "⚧️", "Is your first name given to both boys and girls?", 0.1, "low", null, "Rough global estimate"),
    q("changed-first-name", "🦋", "Have you ever officially changed your first name?", 0.02, "low", null, "Rough global estimate"),
    q("likes-own-name", "💖", "Do you like your own name?", 0.7, "low", null, "Rough survey-flavored estimate"),
    q("would-pass-down-name", "🎁", "Would you name a child after someone in your family?", 0.3, "low", null, "Rough global estimate"),
    q("pet-human-name", "🐶", "Have you ever had a pet with a human name?", 0.25, "low", null, "Rough global estimate"),
    q("often-misspelled", "❌", "Do people often misspell your name?", 0.35, "low", null, "Rough global estimate"),
    q("famous-namesake", "🌟", "Do you share your first name with someone famous?", 0.35, "low", null, "Rough global estimate"),
  ]);
})();
