// Health & senses (60). Trivia-grade only — nothing invasive. WHO/NIH figures
// where they exist, honest rough estimates elsewhere.
(() => {
  const C = "health";
  const q = (id, emoji, text, pYes, confidence, group, note) =>
    ({ id: C + "-" + id, emoji, text, pYes, category: C, confidence, group, note });
  globalThis.QUESTIONS = (globalThis.QUESTIONS || []).concat([
    // --- vision correction (one per run) ---
    q("wears-glasses", "👓", "Do you wear glasses?", 0.35, "medium", "vision", "≈2.6B people use vision correction; access varies hugely"),
    q("wears-contacts", "🫧", "Do you wear contact lenses?", 0.08, "low", "vision", "Rough global estimate"),
    q("glasses-or-contacts", "🤓", "Do you use glasses or contact lenses at least sometimes?", 0.38, "medium", "vision", "≈2.6B people wear correction; billions more need it (WHO)"),
    q("sharp-uncorrected-vision", "🦅", "Can you see sharply without any correction?", 0.55, "low", "vision", "Rough complement of correction users and those needing it"),
    // --- allergies (one per run) ---
    q("any-allergy", "🌼", "Do you have any allergy?", 0.35, "medium", "allergies", "WHO estimates 30–40% affected by one or more allergic conditions"),
    q("hay-fever", "🤧", "Do you get hay fever (pollen allergy)?", 0.2, "medium", "allergies", "Allergic rhinitis ≈ 10–30% by region"),
    q("food-allergy", "🥜", "Do you have a food allergy?", 0.06, "medium", "allergies", "≈2–10% by region and age; global rough figure"),
    q("penicillin-allergy", "💊", "Are you allergic to penicillin?", 0.08, "low", "allergies", "≈10% report it in Western data; much is unconfirmed"),
    // --- headaches (one per run) ---
    q("migraines", "🌩️", "Do you get migraines?", 0.14, "high", "headaches", "≈14% of world population (WHO / Global Burden of Disease)"),
    q("frequent-headaches", "🤕", "Do you get headaches at least once a week?", 0.25, "low", "headaches", "Rough global estimate"),
    // --- dental history (one per run) ---
    q("had-cavity", "🍬", "Have you ever had a cavity?", 0.7, "medium", "dental-work", "Untreated caries alone affects ≈2B adults (WHO); lifetime share far higher"),
    q("has-fillings", "🪙", "Do you have any dental fillings?", 0.5, "low", "dental-work", "Rough global estimate; depends on dental care access"),
    q("root-canal", "🦷", "Have you ever had a root canal?", 0.15, "low", "dental-work", "Rough global estimate"),
    q("tooth-pulled", "🪥", "Have you ever had a tooth pulled (not counting baby teeth)?", 0.4, "low", "dental-work", "Rough global estimate"),
    // --- surgery (one per run) ---
    q("had-surgery", "🏥", "Have you ever had surgery?", 0.35, "low", "surgery", "≈300M operations/year worldwide; rough lifetime estimate"),
    q("general-anesthesia", "😴", "Have you ever been under general anesthesia?", 0.3, "low", "surgery", "Subset of surgery; rough estimate"),
    // --- independent ---
    q("colorblind", "🎨", "Are you colorblind?", 0.045, "high", null, "≈8% of men and 0.5% of women (red-green)"),
    q("asthma", "🌬️", "Do you have asthma?", 0.032, "high", null, "≈260M people worldwide (WHO)"),
    q("lactose-intolerant", "🥛", "Are you lactose intolerant?", 0.3, "low", null, "≈68% have lactose malabsorption (NIH) but far fewer notice symptoms"),
    q("wisdom-teeth-removed", "😮", "Have you had wisdom teeth removed?", 0.1, "low", null, "Routine in North America, rare elsewhere; rough estimate"),
    q("had-braces", "😬", "Have you ever worn orthodontic braces?", 0.08, "low", null, "Rough global estimate; concentrated in wealthy countries"),
    q("broken-bone", "🦴", "Have you ever broken a bone?", 0.4, "low", null, "Rough global estimate"),
    q("had-stitches", "🪡", "Have you ever needed stitches?", 0.35, "low", null, "Rough global estimate"),
    q("hospital-overnight", "🛏️", "Have you ever stayed overnight in a hospital (besides your birth)?", 0.45, "low", null, "Rough global estimate"),
    q("ambulance-ride", "🚑", "Have you ever ridden in an ambulance?", 0.15, "low", null, "Rough global estimate"),
    q("appendix-removed", "➕", "Has your appendix been removed?", 0.07, "medium", null, "Lifetime appendectomy ≈ 7–9% where surgery is accessible"),
    q("tonsils-removed", "🗣️", "Have your tonsils been removed?", 0.08, "low", null, "Common for older generations; rough estimate"),
    q("had-chickenpox", "🐔", "Have you had chickenpox?", 0.6, "medium", null, "Near-universal before vaccination; vaccinated cohorts lower"),
    q("had-covid", "🦠", "Have you had COVID-19 (that you know of)?", 0.6, "low", null, "Most of the world was infected at least once; many never confirmed it"),
    q("childhood-vaccinations", "💉", "Did you receive routine childhood vaccinations?", 0.84, "high", null, "DTP3 coverage ≈ 84% of children (WHO/UNICEF)"),
    q("donated-blood", "🩸", "Have you ever donated blood?", 0.06, "medium", null, "≈118M donations/year (WHO); rough lifetime-donor estimate"),
    q("sun-sneeze", "🌞", "Do you sneeze when you step into bright sunlight?", 0.25, "medium", null, "Photic sneeze reflex ≈ 18–35% in studies"),
    q("tinnitus", "🔔", "Do you have ringing in your ears (tinnitus)?", 0.15, "medium", null, "≈14% of adults experience tinnitus (meta-analyses)"),
    q("motion-sickness", "🚗", "Do you get motion sickness easily?", 0.25, "medium", null, "≈1 in 3 is susceptible; ≈25% affected in ordinary travel"),
    q("ever-fainted", "😵", "Have you ever fainted?", 0.3, "medium", null, "Lifetime syncope ≈ 30–40% in studies"),
    q("had-nosebleed", "🔴", "Have you ever had a nosebleed?", 0.6, "low", null, "≈60% lifetime prevalence in studies"),
    q("bee-sting", "🐝", "Have you ever been stung by a bee or wasp?", 0.55, "low", null, "Rough global estimate"),
    q("sprained-ankle", "🩹", "Have you ever sprained an ankle?", 0.4, "low", null, "Rough global estimate"),
    q("had-concussion", "🥊", "Have you ever had a concussion?", 0.1, "low", null, "Rough global estimate"),
    q("daily-medication", "⏰", "Do you take a medication every day?", 0.3, "low", null, "Rough global estimate; rises steeply with age"),
    q("snores", "😪", "Do you snore (according to someone who'd know)?", 0.3, "low", null, "Habitual snoring ≈ 25–40% of adults"),
    q("sleepwalked", "🚶", "Have you ever sleepwalked?", 0.07, "medium", null, "≈7% lifetime prevalence (meta-analysis)"),
    q("insomnia-nights", "🌃", "Do you regularly have trouble falling asleep?", 0.3, "medium", null, "Insomnia symptoms affect ≈30% of adults"),
    q("hearing-aid", "🦻", "Do you use a hearing aid?", 0.02, "medium", null, "≈430M people need hearing care (WHO); far fewer have aids"),
    q("had-head-lice", "🔍", "Have you ever had head lice?", 0.4, "low", null, "Childhood rite of passage worldwide; rough estimate"),
    q("food-poisoning", "🤢", "Have you ever had food poisoning?", 0.6, "low", null, "≈600M foodborne illnesses per year (WHO); rough lifetime estimate"),
    q("broken-nose", "👃", "Have you ever broken your nose?", 0.1, "low", null, "Rough global estimate"),
    q("black-eye", "🥋", "Have you ever had a black eye?", 0.25, "low", null, "Rough global estimate"),
    q("flu-shot-ever", "🤒", "Have you ever had a flu shot?", 0.3, "low", null, "Rough global estimate; routine in some countries, rare in others"),
    q("dentist-past-year", "🪥", "Have you been to a dentist in the past year?", 0.4, "low", null, "Rough global estimate; access varies hugely"),
    q("had-malaria", "🦟", "Have you ever had malaria?", 0.08, "low", null, "≈250M cases/year concentrated in endemic regions; rough lifetime share"),
    q("had-wart", "🐸", "Have you ever had a wart?", 0.3, "low", null, "Rough global estimate"),
    q("sleeps-8-hours", "🛌", "Do you usually get 8 hours of sleep?", 0.3, "low", null, "Surveys put the average adult well under 8 hours"),
    q("drinks-2l-water", "💧", "Do you drink about 2 litres of water a day?", 0.25, "low", null, "Rough global estimate"),
    q("daily-sunscreen", "🧴", "Do you wear sunscreen every day?", 0.1, "low", null, "Rough global estimate"),
    q("sunburn-last-year", "🦞", "Did you get sunburnt in the past year?", 0.3, "low", null, "Rough global estimate; skin tone and latitude dependent"),
    q("tried-acupuncture", "📍", "Have you ever tried acupuncture?", 0.08, "low", null, "Rough global estimate; mainstream in East Asia"),
    q("physical-therapy", "🤸", "Have you ever done physical therapy (physiotherapy)?", 0.15, "low", null, "Rough global estimate"),
    q("had-mri", "🧲", "Have you ever had an MRI scan?", 0.15, "low", null, "Rough global estimate; scanner access varies by country"),
    q("had-xray", "☠️", "Have you ever had an X-ray?", 0.6, "low", null, "Rough global estimate including dental X-rays"),
  ]);
})();
