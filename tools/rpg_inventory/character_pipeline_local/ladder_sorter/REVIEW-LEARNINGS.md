# Ladder sorter review learnings — 2026-07-21

Source: completed 162-board review exported from the local ladder sorter.

## Outcome

- 92 assistant destinations confirmed unchanged.
- 34 character destinations corrected.
- 36 boards ignored as non-character, unusable, or duplicate output.
- Exact destination accuracy among retained character boards: 92/126 (73.0%).
- Exact destination accuracy across the entire intake: 92/162 (56.8%).

Confidence was too generous. Of 125 `high` guesses, 86 were confirmed, 27
were corrected, and 12 were ignored. Of 21 `medium` guesses, 6 were confirmed,
7 corrected, and 8 ignored. All 16 `low` guesses were ignored.

## Mandatory eligibility pass before labeling

First decide whether the board is a usable human-form character reference.
Ignore it before attempting faction, axis, or tier when it is primarily:

- a beast, animal harness, insect, bird-creature, or mounted creature system;
- an apparatus, crane, workshop, shrine platform, mechanical attendant, or
  freestanding equipment construct;
- an elevated spirit, wraith, transformed entity, or empty animated armor;
- a multi-character/composite board rather than one separated character; or
- a duplicate or near-duplicate character board that adds no useful variant.

Do not confuse a surrounding set of item studies with proof that a central
human character exists. Inspect the central subject first.

## Axis correction

Axis was the largest retained-character error: 18 corrections. Twelve were
`STR -> DEX`, with another two `INT -> DEX`. Do not classify from weapon mass
alone. An axe, shield, spear, sickle, trident, or tall shield can still be DEX
when the whole kit emphasizes mobility, reach control, precision, carried
utility, light layering, or skirmishing. STR requires the loadout's overall
solution to be force, weight, impact, or protection—not merely possession of a
large weapon.

Observed direction counts:

- STR -> DEX: 12
- INT -> DEX: 2
- DEX -> STR: 2
- STR -> INT: 1
- INT -> STR: 1

## Faction and tier correction

There were 10 faction corrections and 6 tier corrections. The most repeated
faction error was Stonewood -> Dustwind (3). Read construction language before
palette: warm lamellar, curved swords, hide shields, framed carriers, blue or
purple bounded cloth, and travel layering may indicate Dustwind even when the
colors are earthy. Do not let a single feather, pale textile, dark skin tone,
or weapon family override the complete cultural construction system.

Tier must follow macro construction and consequence, not adjectives such as
"elite" or surface polish. The user moved four retained boards upward one tier
and two downward one tier.

## Next-batch procedure

1. Run the human-character eligibility/duplicate gate first.
2. Label each surviving board independently; filename position remains metadata.
3. Decide axis from the whole equipment solution, explicitly testing DEX before
   assigning STR to axe-, spear-, shield-, or pack-bearing kits.
4. Decide faction from several construction cues, not one palette cue.
5. Calibrate confidence against all four decisions: eligibility, faction, axis,
   and tier. Any uncertain eligibility prevents a `high` label.

