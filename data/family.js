// Family & relationships (60). Birth-order math falls out of global fertility
// (≈2.2 children per family → ≈45% firstborns); the rest is survey-flavored.
(() => {
  const C = "family";
  const q = (id, emoji, text, pYes, confidence, group, note) =>
    ({ id: C + "-" + id, emoji, text, pYes, category: C, confidence, group, note });
  globalThis.QUESTIONS = (globalThis.QUESTIONS || []).concat([
    // --- birth order & siblings (one per run) ---
    q("firstborn", "🥇", "Are you the firstborn child in your family (or an only child)?", 0.45, "medium", "birth-order", "≈1/global fertility rate of 2.2 children"),
    q("youngest-child", "🍼", "Are you the youngest child in your family?", 0.45, "medium", "birth-order", "Mirrors the firstborn share; ≈1 in 2.2"),
    q("middle-child", "🥪", "Are you a middle child (neither oldest nor youngest)?", 0.15, "medium", "birth-order", "Remainder after firstborns and youngest at fertility ≈2.2"),
    q("only-child", "1️⃣", "Are you an only child?", 0.12, "low", "birth-order", "Rough estimate; boosted by China's one-child generations"),
    q("has-sibling", "👧", "Do you have at least one sibling?", 0.88, "low", "birth-order", "Complement of only children"),
    q("three-plus-siblings", "👨‍👩‍👧‍👦", "Do you have three or more siblings?", 0.4, "low", "birth-order", "Larger families dominate older cohorts and high-fertility regions"),
    q("has-sister", "👭", "Do you have a sister?", 0.6, "low", "birth-order", "Rough estimate given sibling distribution"),
    q("has-brother", "👬", "Do you have a brother?", 0.6, "low", "birth-order", "Rough estimate given sibling distribution"),
    q("older-brother", "🧢", "Do you have an older brother?", 0.35, "low", "birth-order", "Rough estimate given sibling distribution"),
    // --- twins (one per run) ---
    q("is-twin", "👯", "Are you a twin?", 0.033, "high", "twin", "≈1 in 30 people is a twin (twin-birth rates)"),
    q("identical-twin", "🪞", "Are you an identical twin?", 0.012, "high", "twin", "≈4 per 1,000 births are identical-twin deliveries"),
    q("is-triplet", "🎰", "Are you a triplet?", 0.001, "medium", "twin", "Roughly 1 in 1,000 people; rarer before IVF"),
    // --- relationship status (one per run) ---
    q("is-married", "💍", "Are you married?", 0.4, "medium", "marital", "Most adults worldwide are married (UN); scaled to include children"),
    q("ever-married", "👰", "Have you ever been married?", 0.45, "medium", "marital", "UN marital-status data scaled to all ages"),
    q("in-relationship", "❤️", "Are you in a romantic relationship?", 0.55, "low", "marital", "Married plus partnered; rough estimate"),
    // --- children & grandchildren (one per run) ---
    q("has-children", "👶", "Do you have children?", 0.4, "medium", "children", "≈2 billion mothers plus fathers, scaled to total population"),
    q("two-plus-children", "🧒", "Do you have two or more children?", 0.28, "low", "children", "Rough estimate from fertility distributions"),
    q("is-grandparent", "👵", "Are you a grandparent?", 0.12, "low", "children", "Rough estimate from age structure and fertility"),
    // --- cousins (one per run) ---
    q("ten-plus-cousins", "🎪", "Do you have ten or more first cousins?", 0.4, "low", "cousins", "Rough estimate; large extended families are the global norm"),
    q("twenty-plus-cousins", "🎡", "Do you have twenty or more first cousins?", 0.15, "low", "cousins", "Rough estimate"),
    q("no-cousins", "🕳️", "Do you have no first cousins at all?", 0.06, "low", "cousins", "Rough estimate; rare outside low-fertility regions"),
    // --- name origin (one per run; shared group with names category) ---
    q("named-after-relative", "🏷️", "Were you named after a relative?", 0.15, "low", "named-after", "Rough global estimate"),
    q("named-after-fiction", "🎬", "Were you named after a character, celebrity or song?", 0.05, "low", "named-after", "Rough global estimate"),
    // --- great-grandparents (one per run) ---
    q("met-great-grandparent", "🕰️", "Did you ever meet a great-grandparent?", 0.15, "low", "great-grandparent", "Rough estimate; rising with life expectancy"),
    q("living-great-grandparent", "🌳", "Do you have a living great-grandparent?", 0.08, "low", "great-grandparent", "Rough estimate; mostly the very young"),
    // --- independent ---
    q("living-grandparent", "👴", "Is at least one of your grandparents alive?", 0.55, "low", null, "Rough estimate; strongly tied to your own age"),
    q("shares-parent-name", "📛", "Do you share your first name with a parent?", 0.05, "low", null, "Rough global estimate; a strong tradition in some cultures"),
    q("has-aunt-uncle", "🧓", "Do you have an aunt or uncle?", 0.9, "low", null, "Nearly everyone whose parents had siblings"),
    q("is-aunt-uncle", "🎁", "Are you an aunt or uncle?", 0.55, "low", null, "Rough estimate"),
    q("has-godparent", "⛪", "Do you have a godparent?", 0.25, "low", null, "Custom concentrated in Christian cultures; rough estimate"),
    q("family-reunion", "🎪", "Have you ever been to a family reunion?", 0.3, "low", null, "Rough global estimate"),
    q("met-partner-online", "💻", "Did you meet a partner online?", 0.1, "low", null, "Rough estimate across everyone, partnered or not"),
    q("family-group-chat", "📱", "Is your family in a group chat together?", 0.4, "low", null, "Rough global estimate; the modern family bulletin board"),
    q("daily-family-dinner", "🍽️", "Do you usually eat dinner with family?", 0.45, "low", null, "Rough global estimate"),
    q("lives-near-parents", "🏡", "Do you live within an hour of your parents (or did they, of you)?", 0.55, "low", null, "Rough global estimate; most people stay close to home"),
    q("knows-grandparents-names", "📜", "Can you name all four of your grandparents' first names?", 0.4, "low", null, "Rough global estimate"),
    q("knows-great-grandparent-name", "🗝️", "Can you name even one great-grandparent's first name?", 0.3, "low", null, "Rough global estimate"),
    q("same-surname-since-birth", "🖋️", "Do you still use the surname you were born with?", 0.8, "low", null, "Rough estimate; name changes cluster around marriage customs"),
    q("has-stepsibling", "🧩", "Do you have a stepsibling or half-sibling?", 0.1, "low", null, "Rough global estimate"),
    q("twin-in-family", "🎭", "Is there a set of twins in your immediate or extended family?", 0.15, "low", null, "Rough estimate given ≈3% twin rate across many relatives"),
    q("left-handed-parent", "🖐️", "Is at least one of your parents left-handed?", 0.19, "medium", null, "1 − 0.9², assuming ≈10% left-handedness"),
    q("weekly-family-video-call", "📹", "Do you video-call family at least once a week?", 0.35, "low", null, "Rough global estimate"),
    q("holidays-with-extended-family", "🎉", "Do you usually spend major holidays with extended family?", 0.55, "low", null, "Rough global estimate"),
    q("family-recipe", "🍲", "Does your family have a recipe passed down through generations?", 0.4, "low", null, "Rough global estimate"),
    q("owns-heirloom", "⌚", "Do you own a family heirloom?", 0.25, "low", null, "Rough global estimate"),
    q("knows-family-tree", "🌲", "Can you trace your family tree back three or more generations?", 0.2, "low", null, "Rough global estimate"),
    q("relative-abroad", "✈️", "Do you have a close relative living in another country?", 0.4, "low", null, "≈281M international migrants each have family back home"),
    q("relative-never-met", "❓", "Do you have first cousins you have never met?", 0.6, "low", null, "Rough global estimate"),
    q("attended-family-wedding", "💒", "Have you ever attended a relative's wedding?", 0.7, "low", null, "Rough global estimate"),
    q("wedding-party-member", "🤵", "Have you ever been part of a wedding party (best man, bridesmaid…)?", 0.25, "low", null, "Rough global estimate"),
    q("child-wedding-role", "🌸", "Were you ever a flower girl or ring bearer as a child?", 0.1, "low", null, "Rough global estimate"),
    q("family-game-night", "🎲", "Does your family play board or card games together?", 0.2, "low", null, "Rough global estimate"),
    q("parent-born-abroad", "🌍", "Was either of your parents born in a different country from you?", 0.15, "low", null, "Second-generation share; rough estimate"),
    q("grandparent-lived-with-you", "🏠", "Has a grandparent ever lived in your household?", 0.3, "low", null, "Multi-generational households are the norm in much of the world"),
    q("family-business", "🏪", "Has your family ever run its own business?", 0.3, "low", null, "Rough estimate; family enterprise dominates many economies"),
    q("hosted-family-holiday", "🥘", "Have you ever hosted the family holiday meal?", 0.4, "low", null, "Rough global estimate"),
    q("family-crest-motto", "🛡️", "Does your family have a crest, motto or clan name?", 0.05, "low", null, "Rough global estimate"),
    q("sibling-same-birth-month", "🎂", "Do you share a birth month with a sibling?", 0.15, "low", null, "Rough estimate; ≈1/12 per sibling"),
    q("grew-up-near-grandparents", "🚲", "Did you grow up with grandparents living nearby?", 0.4, "low", null, "Rough global estimate"),
    q("multilingual-household", "🗣️", "Does your family speak more than one language at home?", 0.3, "low", null, "Rough global estimate; common in multilingual countries"),
  ]);
})();
