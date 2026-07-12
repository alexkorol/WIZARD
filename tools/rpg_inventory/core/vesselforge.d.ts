/** Type declarations for vesselforge.js (UMD: `VesselForge` global or require()). */

export interface StatRef { id: string; v: number }
export interface Implicit { label: string; stat: StatRef | null }

export interface FormDef {
  name: string;
  kind: string;
  kindLabel?: string;
  w: number;
  h: number;
  icon?: string;
  weapon?: { dmg: [number, number]; aps: number };
  armor?: number;
  tags?: string[];
  weights?: Record<string, number>;
  materials?: string[];
  implicit?: Implicit | null;
  noVessel?: boolean;
  noDrop?: boolean;
}

export interface MaterialDef {
  name: string;
  tier: number;
  statMult: number;
  vessel: [number, number];
  patience: [number, number];
  dropWeight?: number;
  ascendsTo?: string | null;
  weights?: Record<string, number>;
}

export interface BrandTier { roll: [number, number]; minIlvl?: number }
export interface BrandModDef {
  label: string;
  shape: 'flat' | 'scalar';
  tags?: string[];
  kinds: string[];
  weight?: number;
  tiers: BrandTier[];
}

export interface BondModDef {
  name: string;
  label: string;
  shape?: 'trigger' | 'conditional';
  roll: [number, number];
}

export interface ThemeDef {
  name: string;
  color?: string;
  mods: Record<string, BondModDef>;
  epithets: string[];
  adjs: string[];
  power: string;
  memory: string;
}

export interface TrophyDef {
  name: string;
  fragments: number;
  kinds: string[];
  mods: Array<{ stat: string; v: number; label: string; shape: string }>;
  completionBonus?: { label: string; shape?: string };
}

export interface Encounter {
  text: string;
  themes: Record<string, number>;
  trophy?: string;
  trophyChance?: number;
}

export interface Pack {
  id: string;
  name?: string;
  settings?: Partial<ForgeSettings>;
  materials: Record<string, MaterialDef>;
  forms: Record<string, FormDef>;
  brandMods: Record<string, BrandModDef>;
  themes: Record<string, ThemeDef>;
  archetypes: Record<string, { name: string; themeId: string }>;
  trophies?: Record<string, TrophyDef>;
  pigments?: Record<string, { name: string; weights: Record<string, number> }>;
  omens?: Record<string, { name: string; tag: string }>;
  panoply?: Record<number, { label: string }>;
  encounters?: Encounter[];
  nameTables?: { pre: string[]; post: string[] };
  retiredForms?: string[];
  retiredMaterials?: string[];
  retiredArtIds?: string[];
  artAliases?: Record<string, string>;
  derive?(sums: Record<string, number>, items: Item[], ctx: AggregateCtx): Record<string, number>;
}

export interface Brand { id: string; modId: string; tier: number; value: number }
export interface Bond {
  id: string;
  modId: string;
  themeId: string;
  base: number;
  tier: 1 | 2 | 3;
  kinship: string | null;
}
export interface TrophySocket { id: string; trophyId: string }
export interface Awakened { name: string; themeId: string; power: string; flavor: string }

export interface Item {
  v: number;
  id: string;
  formId: string;
  materialId: string;
  kind: string;
  w: number;
  h: number;
  ilvl: number;
  vessel: number;
  scars: number;
  patience: number;
  patienceMax: number;
  brands: Brand[];
  bonds: Bond[];
  trophies: TrophySocket[];
  att: { xp: number; next: number; tc: Record<string, number> };
  evolutions: number;
  fired: number;
  epithetName: string | null;
  awakened: Awakened | null;
}

export interface Character {
  v: number;
  name: string;
  archetype: string;
  xp: number;
  gold: number;
  deeds: Record<string, number>;
  fragments: Record<string, number>;
}

export interface ForgeSettings {
  maxVessel: number;
  tierMults: number[];
  brandTierWeights: number[];
  attuneBase: number;
  attuneStep: number;
  estrangedFactor: number;
  fireOutcomes: { ascend: number; scar: number; silent: number; shatter: number };
  brandCountWeights: number[];
  sellBase: number;
}

export interface GameEvent { kind: string; text: string }
export type OpResult = { item: Item; event: GameEvent } | { error: string };
export type FireResult = OpResult | { destroyed: true; event: GameEvent };

export interface AggregateCtx { archetype?: string; level?: number; charName?: string }
export interface Conditional {
  source: string;
  name: string;
  shape: string;
  text: string;
  themeId?: string;
  tier?: number;
  estranged?: boolean;
}
export interface TooltipLine { section: string; text: string; tone: string }
export interface OddsEntry { modId: string; label: string; p: number }

export interface VentureResult {
  character: Character;
  equipment: Record<string, Item | null>;
  drops: Item[];
  fragments: string[];
  events: GameEvent[];
  encounter: Encounter;
}

export interface Forge {
  pack: Pack;
  settings: ForgeSettings;
  reseed(seed: number): void;

  generateItem(opts?: { ilvl?: number; formId?: string; materialId?: string; brands?: number }): Item;
  materialPoolFor(form: string | FormDef, ilvl: number): Array<{ w: number; id: string }>;

  sear(item: Item, opts?: { pigmentId?: string; omenId?: string }): OpResult;
  efface(item: Item): OpResult;
  chisel(item: Item): OpResult;
  fire(item: Item): FireResult;
  explainOdds(item: Item, opts?: { pigmentId?: string; omenId?: string }): OddsEntry[];

  attune(item: Item, xp: number, themeWeights: Record<string, number>, ctx: AggregateCtx): { item: Item; events: GameEvent[] };
  resonate(item: Item): OpResult;
  sever(item: Item): OpResult;
  isSated(item: Item): boolean;

  addFragment(stash: Record<string, number>, trophyId: string): { stash: Record<string, number>; completed: boolean; event: GameEvent } | { error: string };
  socketTrophy(item: Item, trophyId: string, stash: Record<string, number>): { item: Item; stash: Record<string, number>; event: GameEvent } | { error: string };
  pryTrophy(item: Item): OpResult;

  createCharacter(opts?: { name?: string; archetype?: string; gold?: number }): Character;
  charLevel(c: Character): number;
  venture(character: Character, equipment: Record<string, Item | null>, opts?: { encounter?: Encounter }): VentureResult;

  aggregate(items: Array<Item | null>, ctx?: AggregateCtx): {
    sums: Record<string, number>;
    sheet: Record<string, number>;
    conditionals: Conditional[];
    panoplies: Array<{ kinship: string; count: number; bonus: { label: string } }>;
  };
  panoply(items: Array<Item | null>): Array<{ kinship: string; count: number; bonus: { label: string } }>;
  tooltip(item: Item, ctx?: AggregateCtx): TooltipLine[];
  sellValue(item: Item): number;
  displayName(item: Item): string;
  dominantBondTheme(item: Item): string | null;
  bondValue(bond: Bond, estranged: boolean): number;
  isEstranged(bond: Bond, archetype?: string): boolean;
  freeSlots(item: Item): number;

  serialize(state: unknown): string;
  deserialize(raw: string): unknown;
}

export function createForge(pack: Pack, opts?: { seed?: number }): Forge;
export function validatePack(pack: Pack): string[];
export const version: string;
