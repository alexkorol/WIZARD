# Wave 05 source audit - `mobility_headload_basket`

Date: 2026-07-24  
Generation status: **not generated**  
Verdict: **REJECT as a mobility-rig roster item**

## Roster gate

The Meketre model proves that people carried loaded baskets on their heads.
It does not prove a distinct equippable "basket cradle." The mobility
advantage comes from a carrying technique performed by the bearer, not from a
visible harness, suspension system, frame, headpiece, or other separable
mobility mechanism.

When isolated and emptied, the source-observed object is a generic basket. It
does not retain enough slot identity to read as a 2x2 ARPG mobility kit. Making
it read as one would require invented straps, a head ring, a crown pad, a
rigid cradle, or other hardware absent from the source.

Visibility in a character/model scene is not automatic roster approval. This
is an incidental offering container and should remain source context rather
than become a generated base item.

## Official source and local views

Metropolitan Museum of Art, object 20.3.8, *Model of a procession of offering
bearers*, Dynasty 12, early reign of Amenemhat I, ca. 1981-1975 BC, from the
Tomb of Meketre (TT 280), object page:
<https://www.metmuseum.org/art/collection/search/544125>

The Met record identifies two women with baskets: one basket contains beer
bottles and conical bread loaves, and the other contains square loaves. The
model as a whole is plastered and painted wood with linen. The images are
Public Domain.

Downloaded official Open Access views:

| Local reference | Met image role | SHA-256 |
|---|---|---|
| `references/met_544125_meketre_offering_bearers_view_01.jpg` | oblique front/left overview; shows both loaded head baskets and their squared plans | `1D1A0497966E0B0C45C0089C406701FD910B83BA8966E0DEDA2F70FAB4B41962` |
| `references/met_544125_meketre_offering_bearers_view_02.jpg` | complementary oblique overview; confirms direct crown balancing and lack of shoulder suspension | `84BF690044A1A309AA68B36DC24469246501401A322C63C86C0544A7F89BA1A2` |
| `references/met_544125_meketre_offering_bearers_view_03.jpg` | near-side overview; confirms tall box proportions and loaded condition | `C264E0E35D8395824AB69976931015B1A4777E69708327062A75A8302010EDE8` |
| `references/met_544125_meketre_offering_bearers_view_04.jpg` | clearest side view; shows two different loaded baskets directly above the women’s heads | `07FCE96CE07501DEBDB0976124EC652E2A8F1E163EA5CAFCD2C7B9BB7871EC2C` |

These views are iconographic evidence for carrying mode and broad basket
shape. They are not preserved basket artifacts and should not be treated as
direct evidence for reed species, weave topology, rim coiling, or joinery.

## What is actually visible

- Two separate baskets, each tall and boxlike rather than broad, shallow, or
  oval.
- Squared or rectangular plans with slightly flared sides.
- Pale faces divided by dark painted horizontal and vertical lines, suggesting
  basket panels or weave courses at model scale.
- Dark bounded upper and lower edges on the more clearly exposed basket.
- Direct balance above the crown/head.
- Contents projecting above the rim in both baskets.

Not visible or not separable:

- an empty interior or shallow load well;
- a low broad oval base;
- a thick coiled rim;
- an attached carrying strap, shoulder strap, harness, handle, frame, buckle,
  rivet, or metal fitting;
- a distinct crown pad, head ring, or cradle independent of the basket;
- the basket underside or its exact contact geometry;
- full-size weave, material joins, or closure construction.

The current row's "broad oval reed basket," "low flat base," "thick coiled
rim," and "shallow load well" are not transcriptions of Met 544125.

## Strict prior-art and dedupe audit

Contact sheet:
`audit/mobility_headload_basket_prior_art_contact.jpg`

- `assets/marsh_ochre.png` already supplies the strongest generic shallow
  woven-basket macro silhouette: a round woven container with thick organic
  rim and visible load. Emptying and enlarging that silhouette would not
  create a new mobility mechanic.
- `assets/quiver_rawhide.png`, Pilot 02's lacquered-reed quiver, and the Wave
  01 woven quiver are long purpose-built carry containers with explicit
  suspension. They are distinct in shape but much stronger in slot identity.
- Balanced carry outputs assigned to bark, rawhide, copper-mouth, and gorytos
  rows are all strapped or purpose-built containers.
- The balanced bentwood frame assigned to
  `mobility_bentwood_frame` has rails, crossbar, and suspension, so it reads as
  a mobility rig even when empty.
- The balanced wicker pack has a rectangular woven body, closure, loops, and
  straps. It is the nearest basket/pack family and already reads more clearly
  as equipment than an empty head basket would.
- The balanced pannier/pack-saddle output was explicitly rejected as animal
  cargo gear, reinforcing that a visible container does not earn a human
  mobility slot by itself.
- Post-calibration review contains no promotable head basket. The one mobility
  harness candidate was rejected because it lacked a complete ancient
  backboard/load system; the same completeness test is fatal here.
- `quickrig_hide` is a complete strapped fast-access harness with contained
  tools. It does not duplicate the basket, but it demonstrates the required
  level of mechanically legible slot identity.

## 2x2 silhouette test

A squared loaded head basket could occupy a 2x2 canvas, but an **empty**
source-faithful version would read as a plain open box or storage basket. It
would not visually communicate "leaves shoulders and arms free" without a
character, anatomy, explanatory UI, or invented head-support component.

Changing it to the row's proposed broad oval shallow cradle would improve icon
readability only by departing from the source and approaching the existing
`marsh_ochre` basket silhouette.

## Locks if revisited outside the mobility roster

If the object is ever used as an environmental prop, offering container, or
loaded consumable:

- keep the tall squared/trapezoidal basket body shown in the model;
- treat the painted grid only as coarse representational evidence for basket
  paneling or weave, not a literal full-size join map;
- use no shoulder straps, backpack straps, handles, metal hardware, pack
  saddle, or modern backpack form;
- do not invent a separate crown cradle or head ring;
- do not claim the Met model directly documents a broad oval reed basket,
  thick coiled rim, shallow well, or exact weave;
- do not include the model's bread, beer vessels, birds, linen, figures, or
  funerary context unless the target is specifically an offering prop.

## Hazards

- Converting a generic basket into equipment by adding unsupported straps or
  hardware.
- Copying the model's painted grid as machine-even full-size basketry.
- Retaining bread or beer containers and accidentally creating a multi-item
  bundle.
- Isolating a loaded basket when the roster row asks for an empty cradle.
- Inventing an oval/shallow form from prose after the official views show a
  tall squared form.
- Treating direct head balancing as proof of a separable wearable component.
- Duplicating the existing woven ochre basket or calibrated wicker pack while
  merely renaming the result a mobility rig.

## Final disposition

**REJECT `mobility_headload_basket` from the ARPG mobility-rig generation
queue.** Do not write a prompt or generate it. The Meketre baskets may remain
reference material for scene dressing, offering props, or a future explicitly
loaded container, but they do not support a distinct empty 2x2 mobility-kit
base without invention.
