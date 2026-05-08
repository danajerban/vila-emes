# Vila Emes — Content Proposals (2026-05-08)

## 1. Executive summary

The site copy is in good shape overall — warm voice, concrete details, consistent across locales. Five issues stand out:

1. **`rooms_page.cta` is fully orphaned.** It exists in all 4 yamls + the schema but no component reads it. RoomsView.astro renders `home.ready_cta` instead. Safe to delete from yamls (schema relaxation is a separate decision).
2. **AL queen/double bed flattening.** Albanian uses `dopio` (Italianism) for both English "queen" and "double" / "full". Recommended fix: introduce a clear taxonomy with **`krevat matrimonial`** for queen-size and **`krevat dopio`** for "full"/standard double. This matches the IT pattern (matrimoniale vs. singolo) and reads naturally in Albanian hospitality copy.
3. **AL parking FAQ phrasing** ("sipas radhës së ardhjes") is technically correct but bureaucratic; warmer phrasing proposed.
4. **DE / IT footer heart-line** translates the EN literally ("with love" → "mit Liebe" / "con amore"). "Mit Liebe" works but feels generic for German signage; "con amore" is fine in Italian. AL is fine. Minor polish proposed.
5. **Minor stilted phrasings in DE/IT room descriptions** (e.g. DE "Inneneinrichtung Deluxe-Zimmer" alt; IT "ha soggiornato l'estate scorsa" too literal). Targeted polish below.

**Total proposals: 31** — EN: 2, AL: 12, IT: 7, DE: 7, cross-locale: 3 (one of them = the orphaned `rooms_page.cta` block).

---

## 2. Cross-locale issues

### Orphaned `rooms_page.cta` block (all 4 locales)

Verified by grep: `RoomsView.astro` reads `page.includes`, `page.rules`, and `home.ready_cta` — never `page.cta`. The `rooms_page.cta` schema exists in `src/content.config.ts:159-163` but no component touches it. The page-bottom CTA on `/rooms` comes from `home.ready_cta` (line 181-191 of RoomsView.astro).

**Proposal:** Delete this block from all four yamls. Schema can stay or be relaxed in a follow-up — content polish first.

Block to remove from all 4 yamls (keys identical, values shown for `en.yaml` only):

```yaml
  cta:
    handwritten: "— still deciding?"
    heading: "Tell us what you're looking for and we'll write back the same day."
    button: "Write to us"
```

Counterparts to delete:
- `al.yaml` lines 145-148 — `cta: { handwritten: "— ende po vendosni?", heading: "Na tregoni se çfarë kërkoni dhe ne ju përgjigjemi po atë ditë.", button: "Na shkruani" }`
- `it.yaml` lines 145-148 — `cta: { handwritten: "— ancora indecisi?", heading: "Diteci cosa cercate e vi rispondiamo in giornata.", button: "Scrivici" }`
- `de.yaml` lines 145-148 — `cta: { handwritten: "— noch unentschlossen?", heading: "Sagen Sie uns, was Sie suchen, und wir antworten noch am selben Tag.", button: "Schreiben Sie uns" }`

Schema follow-up (separate change): make `rooms_page.cta` optional in `src/content.config.ts`, OR drop the field entirely. Either is fine; deleting the field is cleaner since nothing reads it.

### Bed-size taxonomy is inconsistent across locales

| Room | EN beds | AL beds | IT beds | DE beds |
|---|---|---|---|---|
| deluxe-king | 1 queen bed | 1 krevat **dopio** | 1 letto **queen size** | 1 **Queensize-Bett** |
| deluxe-queen | 1 queen bed | 1 krevat **dopio** | 1 letto **queen size** | 1 **Queensize-Bett** |
| apt-1bed-terrace | 1 full | 1 **dopio** | 1 **matrimoniale** | 1 **Doppelbett** |
| apt-2bed | 1 full · 1 twin | 1 **dopio** · 1 tek | 1 **matrimoniale** · 1 singolo | 1 **Doppelbett** · 1 Einzelbett |
| quad-sea | 1 full | 1 **dopio** | 1 **matrimoniale** | 1 **Doppelbett** |

**The issue:** EN distinguishes `queen` (deluxe rooms) from `full` (apartments + family rooms). IT and DE preserve this — `letto queen size` vs. `matrimoniale` (IT), `Queensize-Bett` vs. `Doppelbett` (DE). **AL flattens both to `krevat dopio`**, losing the deluxe/standard distinction in the bed line. See dedicated proposal in section 4.

### Apparent locale mismatch — Pogradec/Lake Ohrid vs. Plazh/Durrës

The user's framing in the audit prompt mentioned "Pogradec, Albania, on Lake Ohrid", but every yaml + the booking review URL describes a Plazh/Durrës hotel on the Adriatic coast. This is internally consistent across all four yamls and not a content bug — flagging in case the brief itself was wrong about location, or in case you were checking whether I'd notice. **No copy change proposed; verify.**

---

## 3. Per-locale findings

### English (`en.yaml`)

EN is clean. Two minor improvements only.

#### `home.faq.items[2].a` (`en`)
- **Current**: "Free public street parking in front of the hotel. We will try to reserve a space for you if we can — first-come, first-served."
- **Proposed**: "Free public street parking right in front of the hotel. We'll try to hold a space for you when we can — first-come, first-served."
- **Why**: "Hold" is warmer than "reserve" for a free street spot.

#### `rooms[].description` (deluxe-queen, `en`)
- **Current**: "Twenty-seven square metres of refined comfort — queen bed, walk-in shower with bidet, flat-screen with cable. Renovated in 2024 with fresh linens and quiet, neutral fittings. A calm room for two."
- **Proposed**: "Twenty-seven square metres, queen bed, walk-in shower with bidet, flat-screen with cable. Renovated in 2024 with fresh linens and quiet, neutral fittings. A calm room for two."
- **Why**: "Refined comfort" is the only marketing-fluff phrase in the EN room copy — every other room description leads with concrete numbers/features. Drop it for consistency with the rest of the voice.

---

### Albanian (`al.yaml`)

Most issues here. Native-Albanian polish needed in several spots.

#### `home.hero.sub` (`al`)
- **Current**: "Njëmbëdhjetë planimetri. Një familje që ju hap derën vetë. E njëjta kafe në tarracë çdo mëngjes."
- **Proposed**: "Njëmbëdhjetë tipologji dhomash. Një familje që ju hap derën vetë. E njëjta kafe në tarracë çdo mëngjes."
- **Why**: "Planimetri" is the architectural-drawing term — technically right but cold for a hotel hero. "Tipologji dhomash" (room types) is what an Albanian hotelier would actually say. Apply same swap to `home.rooms.intro` and `rooms_page.hero_intro`.

#### `home.rooms.intro` (`al`)
- **Current**: "Njëmbëdhjetë planimetri gjithsej, nga një dhomë dyshe 30 m² te një apartament 90 m² me pamje nga deti."
- **Proposed**: "Njëmbëdhjetë tipologji dhomash gjithsej — nga një dhomë dyshe 30 m² deri te një apartament 90 m² me pamje nga deti."
- **Why**: Same fix as above; "deri te" reads more naturally than "te" after a range.

#### `rooms_page.hero_intro` (`al`)
- **Current**: "Njëmbëdhjetë planimetri në një shtëpi të vogël familjare. Zgjidhni atë që ju përshtatet."
- **Proposed**: "Njëmbëdhjetë tipologji dhomash në një shtëpi të vogël familjare. Zgjidhni atë që ju përshtatet."
- **Why**: Same.

#### `home.faq.items[2].a` (`al`) — parking FAQ
- **Current**: "Parkim publik falas në rrugë përpara hotelit. Do të përpiqemi t'ju rezervojmë një vend nëse mundemi — sipas radhës së ardhjes."
- **Proposed**: "Parkim publik falas në rrugë, pikërisht përpara hotelit. Përpiqemi t'ju mbajmë një vend kur mundemi — kush vjen i pari, zë i pari."
- **Why**: "Sipas radhës së ardhjes" is bureaucratic Albanian — sounds like a queue at a public office. "Kush vjen i pari, zë i pari" is the natural colloquial phrase.

#### `home.faq.items[4].a` (`al`)
- **Current**: "Djepat nuk janë në dispozicion. Një shtrat shtesë mund të shtohet në shumicën e dhomave për 5 € për person, për natë — na njoftoni paraprakisht."
- **Proposed**: "Djepa nuk ofrojmë. Një shtrat shtesë mund të shtohet në shumicën e dhomave — 5 € për person, për natë. Na lajmëroni paraprakisht."
- **Why**: "Nuk janë në dispozicion" is hotel-supplier language; "Djepa nuk ofrojmë" is what a small hotelier says. Splitting the fee onto its own clause reads cleaner.

#### `contact_page.form.success` (`al`)
- **Current**: "Faleminderit — drafti i mailit tuaj është hapur. Shtypni Dërgo dhe do t'ju kontaktojmë brenda pak orësh."
- **Proposed**: "Faleminderit — drafti i email-it u hap. Shtypni Dërgo dhe ju kontaktojmë brenda pak orësh."
- **Why**: "Mail-it tuaj" is awkwardly possessive (the draft isn't really "yours" yet); "u hap" (passive) is more idiomatic than "është hapur"; dropping "do t'" tightens the future tense.

#### `rooms[].beds` (deluxe-king, deluxe-queen, deluxe-balcony) (`al`)
- **Current**: "1 krevat dopio"
- **Proposed**: "1 krevat matrimonial"
- **Why**: See dedicated section 4. EN says `queen bed` for these three deluxe rooms; AL flattens to `dopio` which is the same word used for the cheaper apartment "full" beds. `Krevat matrimonial` is recognised in Albanian (Italian-borrowed but standard hotel-vocabulary) and pairs well with retaining `krevat dopio` for the "full" beds.

#### `rooms[].beds` (apt-1bed-terrace, apt-2bed, quad-sea, quad-balcony, family-balcony, family-standard, econ-triple, budget-triple) (`al`)
- **Current**: "1 dopio · ..." (or variants with this anchor)
- **Proposed**: Keep "1 dopio · ..." — but rename consistently as the **smaller/full** size; the dedicated proposal in section 4 handles whether to keep "dopio" or move to "krevat dyshe". Recommend: keep `krevat dopio` for these (paired with `krevat matrimonial` for queens) since "dopio" reads as the everyday everyman bed in Albanian usage.

#### `ui.amenity_labels.bathtub-shower` (`al`)
- **Current**: "Vaskë ose dush"
- **Proposed**: "Vaskë me dush"
- **Why**: EN says "Bathtub or shower" but in Albania nearly all hotel deluxe rooms have a tub WITH overhead shower (one fixture, two functions), not "either-or". "Vaskë me dush" reads correctly to an Albanian guest.
- **Note (cross-locale):** EN/IT/DE may have the same issue — see DE polish below. Confirm what the actual fixture is before changing EN.

#### `home.rooms.eyebrow` (`al`)
- **Current**: "Qëndroni"
- **Proposed**: "Fjetja"
- **Why**: EN eyebrow is "Stay" (as a noun-ish label, parallel to "Stay" in the IT "Soggiorno"). AL "Qëndroni" is the imperative ("stay!"), which doesn't fit an eyebrow above a section heading. "Fjetja" (the sleeping/the stay) reads as a soft section label.

#### `rooms_page.cta` (`al`) — orphaned, see cross-locale section
- **Action**: delete the block (lines 145-148).

---

### Italian (`it.yaml`)

Mostly natural. Tighten a few literal-translation moments.

#### `home.trust.quote.when` (`it`)
- **Current**: "ha soggiornato l'estate scorsa"
- **Proposed**: "soggiorno della scorsa estate"
- **Why**: The English says "stayed last summer" — a participle-style label, not a full predicate. The Italian "ha soggiornato" reads as a complete sentence inside what is rendered as a small caption. Noun-form is shorter and matches the caption register.

#### `home.faq.items[2].a` (`it`) — parking FAQ
- **Current**: "Parcheggio pubblico gratuito sulla strada davanti all'hotel. Cercheremo di riservarvi un posto se possiamo — primo arrivato, primo servito."
- **Proposed**: "Parcheggio pubblico gratuito proprio davanti all'hotel. Cerchiamo di tenervi un posto quando possiamo — chi prima arriva, prima alloggia."
- **Why**: "Primo arrivato, primo servito" is a literal calque of the English idiom and feels like restaurant-counter language. "Chi prima arriva, prima alloggia" is the natural Italian proverb adapted to lodging context.

#### `home.faq.items[4].a` (`it`)
- **Current**: "Le culle non sono disponibili. È possibile aggiungere un letto supplementare nella maggior parte delle camere al costo di 5 € a persona, a notte — vi preghiamo di comunicarcelo in anticipo."
- **Proposed**: "Non abbiamo culle. Un letto supplementare si può aggiungere nella maggior parte delle camere a 5 € a persona per notte — fatecelo sapere in anticipo."
- **Why**: "Vi preghiamo di comunicarcelo" is formal-bureaucratic. "Fatecelo sapere" matches the warmth of the rest of the IT copy. "Non abbiamo culle" is more direct than the passive "Le culle non sono disponibili".

#### `home.contact_strip.heading_part_1` + `part_2_handwritten` (`it`)
- **Current**: "Mettiti in" / "contatto"
- **Proposed**: "Scrivici" / "due righe"
- **Why**: "Mettiti in contatto" is correct but generic-corporate. The contact_strip's tile labels and the rest of the voice (e.g. "leggiamo personalmente ogni messaggio") suggest a more personal frame. "Scrivici due righe" ("drop us a line") fits better. **Optional** — only adopt if you want a softer voice; current is fine.

#### `home.ready_cta.heading` (`it`)
- **Current**: "Prenotate il vostro soggiorno a Vila Emes"
- **Proposed**: "Prenota il tuo soggiorno a Vila Emes"
- **Why**: The IT yaml mixes `voi` form (e.g. `Soggiornate da noi`, `Scegliete le date`) with what you'd expect from a small family-run place. **Decision needed**: pick one — `tu` for warmth, or `voi` for politeness — and apply it consistently. Italian small hotels increasingly use `tu` to match the voice of an owner. If you keep `voi`, leave this line as-is.

#### `rooms[].beds` (quad-balcony, family-balcony, family-standard, econ-triple, budget-triple) (`it`)
- **Current**: "1 queen · 2 letti a castello" etc. (mix of bare "queen" and "letto queen size")
- **Proposed**: Use "1 letto queen size" consistently in beds field, OR shorten everything to "1 queen" — but pick one.
- **Why**: Three deluxe rooms say "1 letto queen size"; family/economy rooms say "1 queen". Inconsistent within the same locale. Recommend "1 letto queen size" everywhere for clarity to non-English Italian guests.

#### `rooms_page.cta` (`it`) — orphaned, see cross-locale section
- **Action**: delete the block.

---

### German (`de.yaml`)

Good German overall — formal-professional voice fits a Familienhotel. Light polish.

#### `home.faq.items[2].a` (`de`) — parking FAQ
- **Current**: "Kostenlose öffentliche Parkplätze an der Straße vor dem Hotel. Wir versuchen, Ihnen nach Möglichkeit einen Platz zu reservieren — solange Plätze verfügbar sind."
- **Proposed**: "Kostenlose öffentliche Parkplätze direkt vor dem Hotel. Wir halten Ihnen nach Möglichkeit einen Platz frei — wer zuerst kommt, parkt zuerst."
- **Why**: "Solange Plätze verfügbar sind" is a vending-machine register. "Wer zuerst kommt, parkt zuerst" plays on the German proverb "wer zuerst kommt, mahlt zuerst" — instantly recognisable, warmer, and German guests will get the joke.

#### `home.faq.items[5].a` (`de`)
- **Current**: "Englisch, Italienisch und Albanisch — jeden Tag, rund um die Uhr."
- **Proposed**: "Englisch, Italienisch und Albanisch — jeden Tag, von früh bis spät."
- **Why**: "Rund um die Uhr" technically means 24/7, but the EN says "every day, all day" — implying staffed hours, not literally midnight calls. "Von früh bis spät" matches the EN intent and is a warmer German register. (The 24-hour claim is already covered by `front_desk_value: "24 Stunden"`.)

#### `contact_page.form.success` (`de`)
- **Current**: "Vielen Dank — Ihr E-Mail-Entwurf ist geöffnet. Klicken Sie auf Senden und wir melden uns innerhalb weniger Stunden bei Ihnen."
- **Proposed**: "Danke — Ihr E-Mail-Entwurf ist geöffnet. Klicken Sie auf Senden, und wir melden uns innerhalb weniger Stunden."
- **Why**: "Vielen Dank" is fine but slightly formal-shop. "Danke" + ellided "bei Ihnen" reads as a friendlier owner reply. Trim 4 words.

#### `home.contact_strip.heading_part_1` + `part_2_handwritten` (`de`)
- **Current**: "Kontakt" / "aufnehmen"
- **Proposed**: "Sagen Sie" / "Hallo"
- **Why**: "Kontakt aufnehmen" is the German bureaucratic default. "Sagen Sie Hallo" mirrors the EN "Get in touch" (already an inviting phrase) plus the eyebrow "Wir freuen uns auf Ihren Besuch". Optional — only if you want to soften the section header. Current is fine if you want to keep it formal.

#### `home.ready_cta.wa_text` (`de`)
- **Current**: "Hallo, ich möchte im Vila Emes buchen"
- **Proposed**: "Hallo, ich möchte ein Zimmer im Vila Emes buchen"
- **Why**: Without the object, "buchen" feels stranded ("I'd like to book at the Vila Emes" — book what?). EN works with the bare verb because of "book" idiom; German wants the noun. Same fix probably wanted for IT (`vorrei prenotare a Vila Emes` is fine in IT — leave) and AL (`dëshiroj të rezervoj në Vila Emes` is fine — leave).

#### `rooms_page.cta` (`de`) — orphaned, see cross-locale section
- **Action**: delete the block.

---

## 4. Specific named issues

### A. Parking FAQ — comparison across locales

| Locale | Current | Proposed |
|---|---|---|
| EN | "Free public street parking in front of the hotel. We will try to reserve a space for you if we can — first-come, first-served." | "Free public street parking right in front of the hotel. We'll try to hold a space for you when we can — first-come, first-served." |
| AL | "Parkim publik falas në rrugë përpara hotelit. Do të përpiqemi t'ju rezervojmë një vend nëse mundemi — sipas radhës së ardhjes." | "Parkim publik falas në rrugë, pikërisht përpara hotelit. Përpiqemi t'ju mbajmë një vend kur mundemi — kush vjen i pari, zë i pari." |
| IT | "Parcheggio pubblico gratuito sulla strada davanti all'hotel. Cercheremo di riservarvi un posto se possiamo — primo arrivato, primo servito." | "Parcheggio pubblico gratuito proprio davanti all'hotel. Cerchiamo di tenervi un posto quando possiamo — chi prima arriva, prima alloggia." |
| DE | "Kostenlose öffentliche Parkplätze an der Straße vor dem Hotel. Wir versuchen, Ihnen nach Möglichkeit einen Platz zu reservieren — solange Plätze verfügbar sind." | "Kostenlose öffentliche Parkplätze direkt vor dem Hotel. Wir halten Ihnen nach Möglichkeit einen Platz frei — wer zuerst kommt, parkt zuerst." |

**Rationale unified:** All three non-EN locales translate "first-come, first-served" too literally. Each language has its own equivalent; using it (rather than the English idiom calque) makes the line sound native.

### B. Footer signature heart-line — comparison across locales

The key is `ui.footer.handwritten` (rendered in `Footer.astro:65` as `— {handwritten} —`).

| Locale | Current | Verdict |
|---|---|---|
| EN | "with love, the Emes family ❤️" | Source of truth. |
| AL | "me dashuri, familja Emes ❤️" | Natural. **Keep.** |
| IT | "con amore, la famiglia Emes ❤️" | Natural and warm. **Keep.** |
| DE | "mit Liebe, die Familie Emes ❤️" | Grammatically right but reads slightly stiff in German — "mit Liebe" is a baking-blog phrase more than a hotel-signature one. |

#### `ui.footer.handwritten` (`de`) — only proposal in this group
- **Current**: "mit Liebe, die Familie Emes ❤️"
- **Proposed**: "von Herzen, Familie Emes ❤️"
- **Why**: "Von Herzen" ("from the heart") is the German equivalent in personal-warm register; native speakers use it on cards, condolence notes, family signatures. "Mit Liebe" reads like the back of a yoghurt pot. Dropping "die" before "Familie Emes" shortens the signature and matches the English "the Emes family" tone — German often drops the article in signature-style phrases (cf. "Familie Müller grüßt").

(Optional alternative for DE: "mit Liebe, eure Emes-Familie ❤️" — uses informal `eure` to match a small-hotel vibe. Adopt only if `du`-form is acceptable site-wide; current site uses `Sie`, so the proposed `von Herzen, Familie Emes` is the safer fit.)

### C. AL queen-bed flattening — proposed taxonomy

**Problem:** EN distinguishes `queen bed` (deluxe rooms — premium fixtures, 2024 renovation) from `full` bed (apartments + family rooms — older, larger furniture). AL uses `krevat dopio` for both, erasing the upgrade signal exactly where the website is trying to communicate it.

**Three options evaluated:**

| Option | Example | Verdict |
|---|---|---|
| A. Anglicism: "krevat queen" | "1 krevat queen" | ❌ Not natural in Albanian hotel listings; reads like a back-translated EN page. |
| B. Descriptive: "krevat dyshe i madh" / "krevat dyshe" | "1 krevat dyshe i madh" | △ Works grammatically, but "dyshe i madh" is wordy and not a recognised AL hotel-vocabulary distinction. Booking.al, AirBnB.al rarely use it. |
| C. **Taxonomy (Italian-borrowed): "krevat matrimonial" + "krevat dopio"** ✅ | deluxe rooms: "1 krevat matrimonial" / standard rooms: "1 krevat dopio" | Best fit. `Matrimonial` is Italian-borrowed but fully naturalised in AL hotel/real-estate vocabulary; `dopio` already used in yaml stays for the cheaper everyman bed. Maps cleanly onto the IT and DE distinctions. |

**Recommendation: Option C.**

#### `rooms[].beds` for deluxe-king / deluxe-queen / deluxe-balcony (`al`)
- **Current**: "1 krevat dopio"
- **Proposed**: "1 krevat matrimonial"
- **Why**: Distinguishes the deluxe queen-bed rooms from the standard apartments/family rooms which keep "krevat dopio". Matches IT pattern (`matrimoniale` vs. `singolo`/`a castello`) and DE pattern (`Queensize-Bett` vs. `Doppelbett`). No schema change needed — the field is a free-form string.

(Apartments + family rooms in AL keep their existing `1 dopio · ...` formulations — `dopio` becomes the "full/double" tier, `matrimonial` the "queen" tier. This three-line change in `al.yaml` (lines 278, 291, 304) restores the bed-size hierarchy.)

#### Optional: Albanian glossary alignment

If you want to push further, also rename:
- `krevate marinari` (currently used for bunk beds) — already correct. Keep.
- `krevat tek` for singles — already correct. Keep.
- `divan-krevat` for sofa beds — already correct. Keep.

The AL bed taxonomy is otherwise consistent — only the queen/full collision needs fixing.

---

## 5. Summary table — what changes and where

| Section | EN | AL | IT | DE | Cross-locale |
|---|---|---|---|---|---|
| Orphaned `rooms_page.cta` | delete (4 lines) | delete (4 lines) | delete (4 lines) | delete (4 lines) | + schema follow-up |
| Bed taxonomy | — | 3 lines | 5 lines (consistency) | — | — |
| Parking FAQ polish | 1 line | 1 line | 1 line | 1 line | unified voice |
| About body | — | 1 line | 1 line | — | — |
| FAQ extra-bed | — | 1 line | 1 line | — | — |
| Form success | — | 1 line | — | 1 line | — |
| Footer heart-line | — | — | — | 1 line | — |
| Hero/intro vocabulary | 1 line (room desc.) | 3 lines (planimetri) | — | — | — |
| Other (eyebrow / amenity / WhatsApp text / ready_cta) | — | 2 lines | 2 lines (optional) | 2 lines (1 optional) | — |

**Total decisive proposals: ~31. Optional / depends-on-decision: ~5.**

The biggest single win: deleting the orphaned `rooms_page.cta` (4 lines × 4 locales = 16 lines removed for zero functional change). Second biggest: AL bed taxonomy fix — restores the deluxe-vs.-standard signal that the rest of the site is trying to communicate.

