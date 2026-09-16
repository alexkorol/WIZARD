# Wave 05 source audit — `wpn_axe_canaan_window`

## Verdict

**PASS with mandatory exact-geometry corrections — source-complete for a
future prompt, but do not generate in this audit.**

Metropolitan Museum object `325093` (`61.29`) is a genuine Canaanite Middle
Bronze Age bronze fenestrated axe blade with a strong ordinary-weapon identity.
Its compact head has two elongated openings separated by a substantial central
rib and a short cutting edge at the broad end. A specific complete Middle
Bronze Age Levantine bronze-and-wood axe published by Christie's supplies the
missing assembly evidence: a straight one-hand wooden haft passes through the
head's integral socket collars.

The current row is not literal enough to generate unchanged:

- “a large clean open window” must become **two elongated open windows**;
- “narrow crescent cutting edge” must not become a sweeping fantasy crescent;
  the Met head controls the compact tapered/duckbill body and its short,
  restrained cutting edge;
- “compact socket” must preserve the source family's sequence of integral
  collar bands around one continuous straight haft, not a generic single eye;
  and
- “dark haft” may mean plain medium-to-dark reddish-brown wood, but not ebony,
  black lacquer, carved prestige wood, or a metal-clad fantasy handle.

With those locks, the object has an unusually legible ARPG silhouette, a
credible complete assembly, and no exact prior-art duplicate.

## Exact museum source

- Metropolitan Museum of Art object ID: `325093`
- Accession number: `61.29`
- Official record:
  <https://www.metmuseum.org/art/collection/search/325093>
- Title: Fenestrated axe blade
- Object name: Axe
- Culture: Canaanite
- Period: Middle Bronze Age
- Date: ca. early 2nd millennium BCE
- Open Access API begin/end dates: 2000–1750 BCE
- Geography: Levant
- Medium: bronze
- Dimensions: 4.5 × 10.1 × 1.9 cm
- Public domain: yes
- Additional official views: none; the Met API exposes one primary image.
- Chronology gate: **PASS**
- Ordinary weapon identity gate: **PASS**
- Metal-head completeness gate: **PASS**
- Complete hafted-assembly gate: **PASS via the bounded secondary assembly
  source below**

## Secondary complete-assembly source

Christie's lot 143, “A Levantine Bronze and Wood Axe,” Middle Bronze Age,
circa 2000–1500 BC:
<https://www.christies.com/en/lot/lot-6342884>

- Overall length: 53.3 cm
- Blade length: 12.7 cm
- Provenance published by Christie's: Fine Antiquities, Christie's London,
  13–14 December 1983, lot 94; then Dr Giancarlo Ligabue
- The lot essay identifies the fenestrated family, cites a comparable example
  in the Met catalogue, and provides literature.
- The photographs show two open windows, three integral collar bands belonging
  to the head, and one continuous straight wooden haft passing through those
  collars.

**Role limit:** this secondary source controls only complete one-hand scale,
straight-haft proportion, shaft path, and the collar-through seating concept.
It does not override Met `325093`'s blade outline, window shape, rib thickness,
edge profile, or surface detail. Its much broader semicircular blade and
additional bronze sleeves/caps down the haft are not authorized for the Met
row.

## Local reference set and roles

1. `references/met_325093_HB61_29_fenestrated_axe_original.jpg`
   - **Primary and controlling authority for all metal-head geometry.**
   - Official Met Open Access original.
   - Shows the exact compact outline, two elongated openings, central rib,
     broad-end cutting edge, socket-side mass, metal thickness, and plain
     undecorated majority surface.
   - SHA-256:
     `52D941D65FCBEB7317708000710E842A85D37799FC118D988876625E7B633A6B`
2. `references/christies_19876_lot143_levantine_fenestrated_axe_view_1.jpg`
   - **Complete scale and whole-assembly authority.**
   - Full one-hand axe view; establishes the long straight wood-to-head axis.
   - SHA-256:
     `F3C79FB29C737A57BF2A5818CFD718E1082CF8539DB5EB533099B4AE7439770C`
3. `references/christies_19876_lot143_levantine_fenestrated_axe_view_2.jpg`
   - **Haft-interface detail authority.**
   - Close view of the wooden haft passing continuously through the three
     integral collars and across the two open bays.
   - SHA-256:
     `2598DE374D478A39CE2F43274A4C7715CF75B64BCAB56332510C35846CEECBCA`
4. `references/christies_19876_lot143_levantine_fenestrated_axe_view_3.jpg`
   - **Alternate complete-assembly orientation.**
   - Confirms head-to-haft proportion and continuous seating.
   - SHA-256:
     `1B2873166884A35600F49D076D6AF74A6EFD10038FF81A17CA40D8C6595A4B3C`
5. `audit/wpn_axe_canaan_window_prior_art_contact.jpg`
   - **Audit-only strict visual-dedupe sheet.**
   - Includes the exact head, bounded complete-family source, accepted/staged
     axe and adze art, both balanced axe/adze outputs, and the rejected
     post-calibration poleaxe.
   - SHA-256:
     `B3ED805013D833C03DEA7AFB855AF89143457BCB16A740377CDA6C600AB48260`

## Literal row check

| Row claim | Verdict | Evidence |
|---|---|---|
| bronze axe | **Supported** | Met title, object name, medium, date, and exact image. |
| a large clean open window | **Revise** | Exact head has two elongated open windows separated by a robust central rib, not one large void. |
| narrow crescent cutting edge | **Revise** | The exact head is compact and tapered with a short restrained broad-end edge; do not substitute the larger secondary axe's semicircle or a fantasy crescent. |
| compact socket | **Supported only after clarification** | Complete-family source shows the haft passing through a sequence of three integral collar bands, not a generic single modern socket. |
| dark haft | **Supported within limits** | Secondary shows plain reddish-brown wood. Use medium-to-dark natural wood, not black lacquer or exotic prestige finish. |
| plain/no invented ornament | **Supported** | Met head is geometry-led and materially plain. |

## Exact construction locks

- Copy the Met head, not a generic “window axe”:
  - compact bronze body about 10 cm long;
  - two elongated, irregularly organic oval/almond windows;
  - a thick central longitudinal rib between them;
  - enough bronze web around every opening to remain load-bearing;
  - a short, restrained cutting edge at the broad end; and
  - a compact rounded socket-side mass.
- Seat the head over one continuous straight wooden haft following the
  Christie's complete-family example. The wood remains visibly continuous
  through the integral collar sequence.
- The head and haft must remain separate materials at every interface. Show a
  crisp collar lip over wood; do not blend bronze into wood or let the haft
  disappear into solid metal.
- Keep both windows genuinely open. The viewer may see the shaft only where
  the documented assembly places it along the socket-side line; the central
  blade openings must not be filled with wood, leather, shadow sludge, or
  decorative metal.
- Use a modest one-hand haft proportion comparable to the 53.3 cm complete
  Levantine example. Do not scale it into a poleaxe, halberd, greataxe, or
  execution axe.
- Keep the haft plain, straight, round-to-oval, and medium-to-dark natural
  reddish-brown. No sculpted grip, swell, hook, pommel, or modern rubberized
  handle.
- Add no rivet, nail, cross-pin, wedge, screw, seam, leather lashing, rope,
  ferrule, or adhesive fillet unless a future exact source documents it.
- Do not copy the secondary example's extra bronze sleeves or butt cap. They
  are outside the role granted to that reference.

## Active-service finish

The future active-service translation should preserve cast/hammered ancient
character while presenting a maintained weapon:

- warm clean bronze with restrained tonal variation;
- an intact, serviceable edge with a modestly burnished edge line;
- two cleanly legible open windows and solid unbroken ribs;
- plain smooth-used wood with visible grain and a low natural sheen; and
- crisp metal-to-wood seating with no gaps or floating parts.

Do not copy:

- the Met photograph's monochrome tonal cast;
- pitting, edge loss, corrosion crust, dark cavities, or museum background;
- the Christie's example's verdigris, cracked wood, worn blade edge, metal
  shaft sleeves, cap fittings, or auction-photo shadow; or
- perfect CNC symmetry, laser-cut windows, mirror polish, glossy varnish, or
  machined chamfers.

## Framing and ordinary ARPG roster gate

- Requested footprint `P 1x3`: **PASS**
- A roughly 53 cm one-hand assembly with a compact 10 cm head reads strongly
  on a steep diagonal in a portrait 1×3 slot.
- Full framing must show the entire edge, both open windows, upper haft
  projection/seating, and grip end.
- Ordinary weapon identity: **PASS.** The Met catalogues it as an axe, and the
  complete-family source presents a practical one-hand weapon assembly.
- Loot silhouette: **PASS.** The paired openings and collar-through haft
  create a recognizable structural identity without ornament.
- T4 ladder distinction: **PASS if the exact two-window geometry is retained.**
  It escalates through specialized bronze casting and open load-bearing
  construction, not precious material or garnish.

## Strict prior-art and overlap audit

Visual sheet:
`audit/wpn_axe_canaan_window_prior_art_contact.jpg`

Inspected:

- current `handaxe_flint`, `handaxe_bronze`, `handaxe_obsidian`,
  `handaxe_skymetal`, and `war_axe`;
- current `greataxe_bone`, `greataxe_copper`, `greataxe_bronze`,
  `greataxe_obsidian`, and `greataxe_skymetal`;
- Wave 04 `wpn_axe_abydos_adze`;
- both balanced `04__axe_adze.png` outputs;
- post-calibration rejected image 227;
- ready/draft axe-adze ladders, supply map, historical QA, and weapon notes.

Findings:

- No inspected image duplicates the Met head's two elongated windows separated
  by a central rib.
- `handaxe_bronze.png` is the nearest current macro-overlap: a conventional
  bronze crescent with one large inner opening on a wrapped haft. If the row
  keeps saying “a large clean open window” and “crescent,” generation is likely
  to duplicate this asset. Exact paired windows are the required distinction.
- Balanced Dustwind DEX T3 has one large open crescent beneath an ornate
  animal/spined socket treatment. It is assigned to the inclined Luristan
  family and must not donate ornament or openwork shape.
- Balanced North DEX T1 is a conventional socketed crescent axe with a single
  large relief opening and decorative shaft bands. It is not a fenestrated
  two-window match.
- The Wave 04 Abydos adze has a transverse flat copper blade lashed beneath a
  bent knee haft; its action and interface are plainly different.
- Flint/obsidian handaxes use lashed stone heads. Skymetal and current war-axe
  art use fantasy or later-looking socket forms. The greataxes are larger
  two-hand silhouettes.
- Post-calibration 227 is a long-shaft medieval/fantasy poleaxe and remains a
  reject, not prior art to imitate.

## Haft/interface failure taxonomy

Reject any future result containing:

- one giant D-shaped opening or a single crescent void instead of two windows;
- merged windows, a missing central rib, paper-thin webs, or decorative
  filigree;
- a huge sweeping crescent, double bit, beard, hook, pick, spike, hammer poll,
  or fantasy moon blade;
- the broader semicircular Christie's blade substituted for Met `325093`;
- a generic eye socket, hidden modern tang, split haft, side-mounted flat
  blade, or blade simply pasted against the wood;
- a shaft that stops at the first collar, jumps discontinuously between
  collars, fills the windows, or visually fuses into bronze;
- invented pins, pegs, rivets, screws, wedges, lashings, grip wraps, or glue;
- the secondary source's extra bronze sleeves, butt cap, or other shaft
  fittings;
- gold, gems, engraving, animal heads, crests, chevrons, runes, spirals,
  prestige bands, or faction ornament;
- modern machining, laser-cut symmetry, mirror finish, black lacquer, or
  furniture varnish;
- copied pitting, verdigris, broken edge, cracked haft, dirt, shadows, labels,
  or museum/auction backdrop;
- 2×4 great-weapon scale, poleaxe length, cropped grip, cropped edge, or loss
  of either window at icon size.

## Release condition

This row may proceed only after its working brief is corrected to the exact
two-window geometry and the reference roles above are preserved. No further
source is required for the haft. If the row remains a singular-window
“crescent axe,” change the verdict to **HOLD**, because that language will
collapse into existing bronze-handaxe prior art rather than reproduce Met
`325093`.
