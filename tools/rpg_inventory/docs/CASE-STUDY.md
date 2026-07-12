# DRAFT — An Asset Factory, Not a Prompt: 300+ Coherent ARPG Item Icons with Zero Artist Hours

Status: publishable draft for Medium/LinkedIn. Numbers pulled from the repo on
2026-07-10. Alex: personalize the intro, add before/after images (suggestions
marked [IMG]), and cut anything that reads as overclaiming.

---

Everyone has generated a fantasy sword with AI. Almost nobody has generated
three hundred items that look like they shipped in the same game.

The difference isn't the model and it isn't prompt wizardry. It's treating
image generation the way you'd treat any unreliable production dependency:
with budgets, gates, ledgers, and a failure-mode catalog. This is a writeup of
the pipeline behind [Brands & Bonds](https://alexkorol.github.io/WIZARD/tools/rpg_inventory/),
a bronze-age ARPG itemization sandbox whose entire art layer — 122 composed
inventory finals plus a 206-item extraction batch — was produced on a consumer
ChatGPT subscription, a local Python toolchain, and zero artist hours.

[IMG: hero collage — one row of finished icons across material tiers]

## The problem with "just prompt it"

Ad-hoc prompting fails at exactly the thing a game needs: consistency. Ten
great items in ten styles are worth less than ten decent items in one style.
And image models fail in *patterned* ways — the same failures, over and over:

- Long weapons collapse into stubby clubs (the model over-focuses on the
  interesting head and shortens the boring shaft).
- Helmets render as hollow facades with no back to the dome.
- Boots and gloves arrive as singles, not pairs.
- "Not magical" negations desaturate the whole render.
- Amulets drift into gorgets; belts drift into skirts; every faction invents
  a sun medallion if you let it.

None of these are solved by rerolling. Rerolling is how you burn a rate-limited
budget learning the same lesson twice. Each of these is solved by a *rule* —
and rules compound, if you write them down where the next session will find
them.

## The pipeline

Every item flows through the same loop:

**1. A durable target list.** A TSV of item concepts — id, canvas shape,
one-line visual description. A status script diffs it against finished files
and prints a prioritized queue plus today's budget usage. Coverage right now:
79 of 85 active targets have composed finals; 25 concepts were deliberately
discarded rather than forced. The filesystem is the only state; any agent (or
human) can resume the queue cold.

**2. Budgeted generation.** Generations are slow (~3-4 minutes) and throttled,
so the loop enforces discipline: one attempt per item per run, no same-run
rerolls, a daily cap. A failed item goes back to the queue with a note; a
second failure moves it to a blocked list for concept rework — the concept is
assumed wrong before the dice are. A "hung" generation usually completes later
in its chat, so there's a HARVEST-first rule: check old chats before spending
new tokens. Failures are recorded in a strike ledger (a TSV, not vibes), and
the status script hides two-strike items so nobody re-burns budget on them.

**3. A numeric QA gate.** Before any image is accepted, a Python gate checks
what arithmetic can check: canvas aspect against the declared shape, background
flatness (corner-patch standard deviation), subject coverage of the frame, and
whether the subject touches the border (cropping). Only after the numbers pass
does a human — or a vision model — run the eyeball checklist: complete solid
object? correct three-quarter angle? a pair if it's footwear? reads as loot,
not a museum photo?

**4. Local alpha, never generative alpha.** Asking the model for transparent
PNGs produces baked checkerboards often enough that transparency is handled
locally. Flat-background renders go through a matte extractor that keeps dark
subject detail while reopening genuine see-through holes (ring centers, sling
gaps). Extraction batches render on a flat olive-slate matte (`#737A68`) and go
through a chroma key that also decontaminates antialiased edges. We learned the
matte color the hard way: magenta keys cleanly but leaves a hot fringe on every
edge; olive-slate residue reads as neutral dirt. [IMG: magenta-fringe vs
slate-residue close-up]

**5. A failure-mode catalog.** Every patterned failure gets a row: symptom,
cause, fix. "Squished long item → canvas prefix ignored → regen with portrait
prefix." "Glowing skymetal → fantasy prior → describe the material only, never
stack negations." The catalog is the pipeline's memory, and it's why item #300
costs less than item #30.

## The breakthrough: extract the kit, not the item

The single biggest quality jump didn't come from better item prompts. It came
from abandoning them.

A prompt for an isolated "bronze girdle" forces the model to invent a design
system from a noun — so it pastes on lore symbols, random tassels, and
implausible construction. But give the model a full character concept — one
coherent figure whose gear already agrees about materials, ornament density,
and construction — and then ask it to extract each worn slot as a separate
inventory icon, and the details suddenly *belong*. Feathers, shell plates,
cords, and wear patterns work because they came from a kit, not a vacuum.

One character image yields up to ten slot icons: weapon, offhand, helm,
amulet, body, outer layer, belt, ring, hands, footwear. The most recent batch
produced 206 classified review assets this way, each tagged by slot and visual
lane, reviewed in a local dashboard with keep/replace/duplicate/discard status
before anything touches the game. [IMG: character concept next to its ten
extracted slot icons]

The character concepts themselves are built from a versioned block library —
render style, pose, construction rules, slot-hygiene rules, per-faction
material language, per-tier progression — assembled by a script so that a
fix made once (say, "amulets are pendants, never collars") lands in every
future prompt automatically. Prompts are never trimmed for elegance: the image
model has no memory of your project, so every prompt re-states everything.

## What this actually cost

- Software: a static repo, Python + Pillow, and a browser. No paid APIs.
- Generation: a consumer ChatGPT subscription, throttled to a sustainable
  ~10 images/hour in short waves.
- People: one person, part-time, plus AI agents that run the queue
  hands-free — the whole pipeline is documented as runbooks specifically so
  an agent can execute it end to end.

## What transfers to your project

1. **Write the target list before the first prompt.** Coverage beats polish.
2. **One attempt per concept per session.** If it fails twice, the concept is
   wrong — rework the description, don't reroll the dice.
3. **Gate numerically first.** Aspect, background flatness, coverage, and
   crop-touch catch most junk before a human looks.
4. **Own your alpha locally.** Generative transparency lies.
5. **Keep a strike ledger and a failure catalog.** The model's failures are
   patterned; your defenses should be too.
6. **When isolated prompts plateau, prompt the system instead** — generate a
   coherent kit and extract the parts.

The full toolchain — status/queue scripts, QA gate, matte and chroma-key
extractors, review dashboards, prompt-block builder, and the failure catalog —
lives in the open in the [WIZARD repo](https://github.com/alexkorol/WIZARD/tree/main/tools/rpg_inventory).

---

*Draft notes for Alex (delete before publishing):*
- *Title alternatives: "The Boring Discipline That Makes AI Game Art Work";
  "I Built an Asset Factory Out of a Chat Window".*
- *The 300+ figure = 122 composed finals + 206 reviewed extraction assets;
  say "300+ accepted assets" or "122 shipped finals" depending on how
  conservative you want to be.*
- *Good before/after pair: an early black-background gen vs. a current slate
  extraction; also the atlatl (retired as AI-hard) as an honest failure story.*
- *If posting to Medium, the six-rule list is the skimmable payload; keep it.*
