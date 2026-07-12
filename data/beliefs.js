// Preferences & beliefs (40). The great either/or debates plus Pew-measured
// belief questions. Preference pairs share a group.
(() => {
  const C = "beliefs";
  const q = (id, emoji, text, pYes, confidence, group, note) =>
    ({ id: C + "-" + id, emoji, text, pYes, category: C, confidence, group, note });
  globalThis.QUESTIONS = (globalThis.QUESTIONS || []).concat([
    // --- the great either/ors (one of each pair per run) ---
    q("dog-person", "🐕", "Are you a dog person?", 0.4, "low", "dog-cat", "Rough survey-flavored estimate"),
    q("cat-person", "🐈", "Are you a cat person?", 0.25, "low", "dog-cat", "Rough survey-flavored estimate"),
    q("sweet-tooth", "🍰", "Do you prefer sweet over savoury snacks?", 0.45, "low", "sweet-savory", "Rough survey-flavored estimate"),
    q("savory-tooth", "🧀", "Do you prefer savoury over sweet snacks?", 0.5, "low", "sweet-savory", "Rough survey-flavored estimate"),
    q("window-seat", "🪟", "Do you prefer the window seat?", 0.55, "low", "plane-seat", "Airline polls lean window"),
    q("aisle-seat", "🚶", "Do you prefer the aisle seat?", 0.35, "low", "plane-seat", "Airline polls; rough estimate"),
    q("prefers-summer", "☀️", "Do you prefer summer over winter?", 0.55, "low", "season-pref", "Rough survey-flavored estimate"),
    q("prefers-winter", "❄️", "Do you prefer winter over summer?", 0.3, "low", "season-pref", "Rough survey-flavored estimate"),
    q("beach-holiday", "🏖️", "Would you pick a beach holiday over the mountains?", 0.5, "low", "beach-mountains", "Rough survey-flavored estimate"),
    q("mountain-holiday", "🏔️", "Would you pick the mountains over a beach holiday?", 0.4, "low", "beach-mountains", "Rough survey-flavored estimate"),
    q("prefers-city-life", "🌆", "Would you rather live in a big city than the countryside?", 0.45, "low", "city-country", "Rough survey-flavored estimate"),
    q("prefers-country-life", "🌄", "Would you rather live in the countryside than a big city?", 0.45, "low", "city-country", "Rough survey-flavored estimate"),
    q("introvert", "🤫", "Would you call yourself an introvert?", 0.45, "low", "intro-extro", "Self-identification splits near the middle"),
    q("extrovert", "📣", "Would you call yourself an extrovert?", 0.4, "low", "intro-extro", "Self-identification splits near the middle"),
    q("time-travel-past", "🏺", "If you could time travel, would you go to the past?", 0.4, "low", "time-travel", "Rough survey-flavored estimate"),
    q("time-travel-future", "🛸", "If you could time travel, would you go to the future?", 0.45, "low", "time-travel", "Rough survey-flavored estimate"),
    q("power-invisibility", "🫥", "Would you pick invisibility as your superpower (over flight)?", 0.35, "low", "superpower", "The classic playground poll"),
    q("power-flight", "🦅", "Would you pick flight as your superpower (over invisibility)?", 0.5, "low", "superpower", "The classic playground poll"),
    // --- superstition (one per run) ---
    q("superstitious", "🪬", "Are you at all superstitious?", 0.4, "medium", "superstition", "Surveys worldwide put this around 40%"),
    q("lucky-number", "🎰", "Do you have a lucky number?", 0.4, "low", "superstition", "Rough global estimate"),
    q("avoids-13", "🚫", "Does the number 13 (or another 'unlucky' number) make you uneasy?", 0.25, "low", "superstition", "13 in the West, 4 in East Asia; rough estimate"),
    // --- religiosity (one per run) ---
    q("identifies-religious", "🙏", "Do you identify with a religion?", 0.84, "high", "religiosity", "≈84% of the world identifies with a religious group (Pew)"),
    q("prays-weekly", "🕯️", "Do you pray at least weekly?", 0.55, "medium", "religiosity", "Pew: ≈49% of adults pray daily; weekly is higher"),
    q("attends-services", "🕌", "Do you attend religious services at least monthly?", 0.4, "medium", "religiosity", "Pew religious-practice surveys; rough global figure"),
    // --- independent ---
    q("optimist", "🌤️", "Would you call yourself an optimist?", 0.55, "low", null, "Rough survey-flavored estimate"),
    q("feels-lucky", "🍀", "Do you consider yourself a lucky person?", 0.4, "low", null, "Rough survey-flavored estimate"),
    q("checks-horoscope", "🔭", "Do you read your horoscope at least sometimes?", 0.2, "medium", null, "Surveys across countries; rough estimate"),
    q("believes-ghosts", "👻", "Do you believe in ghosts or spirits?", 0.35, "medium", null, "Surveys worldwide cluster between 30–45%"),
    q("believes-aliens", "👽", "Do you believe intelligent alien life exists?", 0.4, "medium", null, "International polls put this near half"),
    q("believes-afterlife", "🌅", "Do you believe in life after death?", 0.55, "medium", null, "Pew multi-country surveys"),
    q("believes-karma", "☸️", "Do you believe in karma — that what goes around comes around?", 0.45, "medium", null, "Core to dharmic religions and popular far beyond"),
    q("love-first-sight", "💘", "Do you believe in love at first sight?", 0.4, "low", null, "Rough survey-flavored estimate"),
    q("believes-soulmates", "🧩", "Do you believe in soulmates?", 0.5, "low", null, "Rough survey-flavored estimate"),
    q("lottery-keep-working", "🎟️", "If you won the lottery, would you keep working?", 0.55, "low", null, "Surveys consistently say most people would"),
    q("toilet-paper-over", "🧻", "Should toilet paper hang over the top (not under)?", 0.55, "low", null, "The eternal debate; polls favour 'over'"),
    q("pineapple-pizza", "🍍", "Does pineapple belong on pizza?", 0.35, "low", null, "The internet's favourite food fight"),
    q("cereal-before-milk", "🥣", "Do you pour cereal before milk?", 0.75, "low", null, "Polls say cereal-first is the strong majority"),
    q("hotdog-is-sandwich", "🌭", "Is a hot dog a sandwich?", 0.3, "low", null, "Rough survey-flavored estimate"),
    q("five-second-rule", "🍪", "Do you believe in the five-second rule for dropped food?", 0.4, "low", null, "Rough survey-flavored estimate"),
    q("subtitles-always-on", "💬", "Do you watch TV with subtitles on, even in your own language?", 0.4, "low", null, "Streaming-era surveys; strongest among younger viewers"),
  ]);
})();
