// Home & living (60). Household appliance stats lean on IEA/World Bank survey
// data; the rest is honestly-labeled estimation.
(() => {
  const C = "home";
  const q = (id, emoji, text, pYes, confidence, group, note) =>
    ({ id: C + "-" + id, emoji, text, pYes, category: C, confidence, group, note });
  globalThis.QUESTIONS = (globalThis.QUESTIONS || []).concat([
    // --- who you live with (one per run) ---
    q("lives-alone", "🚶", "Do you live alone?", 0.05, "medium", "household-type", "Single-person households hold ≈5% of people globally"),
    q("lives-with-family", "👨‍👩‍👧", "Do you live with family?", 0.8, "low", "household-type", "The global norm; rough estimate"),
    q("lives-with-roommates", "🛋️", "Do you live with roommates or flatmates (not family)?", 0.07, "low", "household-type", "Rough global estimate"),
    q("household-five-plus", "🏠", "Do five or more people live in your home?", 0.35, "medium", "household-type", "Global average household ≈ 4 people (UN)"),
    // --- dwelling type (one per run) ---
    q("lives-in-apartment", "🏢", "Do you live in an apartment or flat?", 0.35, "low", "dwelling-type", "Rough global estimate; tracks urbanization"),
    q("house-with-yard", "🌳", "Do you live in a house with a yard, garden or courtyard?", 0.4, "low", "dwelling-type", "Rough global estimate"),
    q("lives-above-5th-floor", "🌇", "Do you live above the 5th floor?", 0.12, "low", "dwelling-type", "Rough estimate; high-rise living concentrated in Asian cities"),
    // --- own or rent (one per run) ---
    q("family-owns-home", "🔑", "Does your family own the home you live in?", 0.65, "medium", "tenure", "Global homeownership ≈ 60–70% of households"),
    q("rents-home", "📄", "Does your household rent your home?", 0.3, "medium", "tenure", "Rough complement of ownership"),
    // --- moved recently (one per run; shared group with demographics) ---
    q("moved-past-year", "📦", "Have you moved home in the past year?", 0.1, "low", "moved-recently", "Rough global estimate"),
    q("five-years-same-home", "🪴", "Have you lived in your current home for more than five years?", 0.55, "low", "moved-recently", "Rough global estimate"),
    // --- pets (one per run) ---
    q("has-pet", "🐾", "Does your household have a pet?", 0.45, "medium", "pets", "Surveys put pet ownership around half of households worldwide"),
    q("has-dog", "🐕", "Does your household have a dog?", 0.3, "medium", "pets", "≈1 in 3 households globally (surveys)"),
    q("has-cat", "🐈", "Does your household have a cat?", 0.25, "medium", "pets", "≈1 in 4 households globally (surveys)"),
    q("has-fish", "🐠", "Does your household keep fish?", 0.08, "low", "pets", "Rough global estimate"),
    q("has-bird", "🦜", "Does your household keep a pet bird?", 0.06, "low", "pets", "Rough global estimate"),
    // --- books at home (one per run) ---
    q("has-bookshelf", "📚", "Is there a bookshelf in your home?", 0.55, "low", "books", "Rough global estimate"),
    q("hundred-plus-books", "🏛️", "Are there more than 100 books in your home?", 0.15, "low", "books", "Rough global estimate"),
    // --- TV (one per run) ---
    q("tv-at-home", "📺", "Is there a TV in your home?", 0.8, "medium", "tv", "≈80% of households have a television (ITU)"),
    q("multiple-tvs", "🎬", "Does your home have more than one TV?", 0.3, "low", "tv", "Rough global estimate"),
    // --- local climate (one per run) ---
    q("snows-where-live", "🌨️", "Does it snow where you live?", 0.3, "low", "home-climate", "Most of humanity lives in snow-free latitudes; rough estimate"),
    q("never-freezes", "🌡️", "Does it stay above freezing all year where you live?", 0.45, "low", "home-climate", "Rough estimate; the tropics never freeze at low altitude"),
    // --- independent ---
    q("has-aircon", "❄️", "Does your home have air conditioning?", 0.35, "medium", null, "≈35% of households own AC (IEA)"),
    q("has-washing-machine", "🌀", "Does your home have a washing machine?", 0.7, "medium", null, "≈70% of households (appliance surveys)"),
    q("has-fridge", "🧊", "Does your home have a refrigerator?", 0.85, "medium", null, "≈85% of households own a fridge (IEA)"),
    q("has-microwave", "🍿", "Does your home have a microwave?", 0.5, "low", null, "Rough global estimate"),
    q("has-dishwasher", "🍽️", "Does your home have a dishwasher?", 0.12, "medium", null, "Common only in North America and parts of Europe"),
    q("has-houseplant", "🪴", "Do you have a living houseplant?", 0.5, "low", null, "Rough global estimate"),
    q("grows-food", "🥕", "Does your household grow any of its own food?", 0.35, "low", null, "Kitchen gardens and smallholdings are the norm in much of the world"),
    q("has-balcony", "🏙️", "Does your home have a balcony?", 0.25, "low", null, "Rough global estimate"),
    q("has-basement", "🕯️", "Does your home have a basement?", 0.1, "low", null, "Regional building style; rough estimate"),
    q("stairs-at-home", "🪜", "Are there stairs inside your home?", 0.35, "low", null, "Rough global estimate"),
    q("shares-bedroom", "🛏️", "Do you share your bedroom with someone?", 0.35, "low", null, "Rough global estimate"),
    q("slept-in-bunk-bed", "🛌", "Have you ever slept in a bunk bed?", 0.4, "low", null, "Rough global estimate"),
    q("piano-at-home", "🎹", "Is there a piano or keyboard in your home?", 0.07, "low", null, "Rough global estimate"),
    q("sewing-machine", "🧵", "Is there a sewing machine in your home?", 0.2, "low", null, "Rough global estimate"),
    q("has-toolbox", "🧰", "Is there a toolbox in your home?", 0.45, "low", null, "Rough global estimate"),
    q("bicycle-at-home", "🚲", "Does your household own a bicycle?", 0.42, "medium", null, "≈42% of households own a bike (global survey research)"),
    q("car-at-home", "🚗", "Does your household own a car?", 0.45, "medium", null, "Roughly half of households worldwide; heavily income-dependent"),
    q("motorcycle-at-home", "🛵", "Does your household own a motorcycle or scooter?", 0.3, "medium", null, "The workhorse vehicle of Asia; ≈30% of households"),
    q("has-spare-room", "🚪", "Does your home have a spare or guest room?", 0.2, "low", null, "Rough global estimate"),
    q("home-office-space", "🖥️", "Is there a dedicated work or study space in your home?", 0.15, "low", null, "Rough global estimate"),
    q("park-within-10min", "🌲", "Is there a park or green space within a 10-minute walk of home?", 0.4, "low", null, "Rough global estimate"),
    q("shop-within-5min", "🏪", "Is there a shop within a 5-minute walk of your home?", 0.55, "low", null, "Corner shops and kirana stores blanket most of the world"),
    q("drinks-tap-water", "🚰", "Do you drink your tap water?", 0.4, "low", null, "Rough estimate; safe supply exists for ~73% but habits differ"),
    q("cooks-with-gas", "🔥", "Does your household cook with gas?", 0.45, "low", null, "Rough global estimate"),
    q("cooks-over-fire", "🪵", "Is any of your household's cooking done over a wood or charcoal fire?", 0.25, "medium", null, "≈2 billion people lack clean cooking fuels (IEA)"),
    q("monthly-power-cut", "🔌", "Does your home lose electricity at least once a month?", 0.25, "low", null, "Routine in much of the world, unthinkable elsewhere"),
    q("door-number-under-50", "🔢", "Is your house or door number below 50?", 0.45, "low", null, "Rough estimate; skip if your home has no number"),
    q("lived-in-3-homes", "🏘️", "Have you lived in three or more different homes in your life?", 0.55, "low", null, "Rough global estimate"),
    q("locks-door-daily", "🔒", "Do you lock your front door every day?", 0.7, "low", null, "Rough global estimate"),
    q("has-alarm-system", "🚨", "Does your home have an alarm system?", 0.1, "low", null, "Rough global estimate"),
    q("smoke-detector", "🔥", "Does your home have a smoke detector?", 0.4, "low", null, "Near-universal where mandated, rare elsewhere"),
    q("fire-extinguisher", "🧯", "Is there a fire extinguisher in your home?", 0.25, "low", null, "Rough global estimate"),
    q("first-aid-kit", "🩹", "Is there a first-aid kit in your home?", 0.4, "low", null, "Rough global estimate"),
    q("home-internet", "📶", "Does your home have an internet connection?", 0.6, "medium", null, "≈2/3 of households are online (ITU)"),
    q("has-printer", "🖨️", "Is there a working printer in your home?", 0.2, "low", null, "Rough global estimate"),
    q("has-landline", "☎️", "Does your home still have a landline phone?", 0.25, "low", null, "Fading fast; rough estimate"),
    q("dries-on-clothesline", "🧺", "Does your household dry laundry on a line or rack?", 0.65, "low", null, "Tumble dryers are the exception worldwide"),
    q("robot-vacuum", "🤖", "Does your home have a robot vacuum?", 0.05, "low", null, "Rough global estimate"),
  ]);
})();
