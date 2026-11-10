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
  dropWeight?: number;
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
  encounters?: Encounter[];
  nameTables?: { pre: string[]; post: string[] };
  retiredForms?: string[];
  retiredMaterials?: string[];
  retiredArtIds?: string[];
  artAliases?: Record<string, string>;
  derive?(sums: Record<string, number>, items: Item[], ctx: AggregateCtx): Record<string, number>;
}

/** seq orders modifiers by when they were added (Remove Last Modifier). */
export interface Brand { id: string; modId: string; tier: number; value: number; seq?: number }
export interface Bond {
  id: string;
  modId: string;
  themeId: string;
  base: number;
  tier: 1 | 2 | 3;
  seq?: number;
}
export interface TrophySocket { id: string; trophyId: string; seq?: number }
/** Upgraded item: named after the character who raised it, with one theme power. */
export interface Awakened { name: string; themeId: string; power: string }

export type Rarity = 'normal' | 'magic' | 'rare';
export interface RarityLimit { brands: number; bonds: number; total: number }

export interface Item {
  v: number;
  id: string;
  formId: string;
  materialId: string;
  kind: string;
  w: number;
  h: number;
  ilvl: number;
  rarity: Rarity;
  brands: Brand[];
  bonds: Bond[];
  trophies: TrophySocket[];
  att: { xp: number; next: number; tc: Record<string, number> };
  evolutions: number;
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
  tierMults: number[];
  brandTierWeights: number[];
  attuneBase: number;
  attuneStep: number;
  rarityLimits: Record<Rarity, RarityLimit>;
  bondsToUpgrade: number;
  dropRarityWeights: Record<Rarity, number>;
  dropBrands: { magic: [number, number]; rare: [number, number] };
  sellBase: number;
}

export interface GameEvent { kind: string; text: string }
export type OpResult = { item: Item; event: GameEvent } | { error: string };

export interface AggregateCtx { archetype?: string; level?: number; charName?: string }
export interface Conditional {
  source: string;
  name: string;
  shape: string;
  text: string;
  themeId?: string;
  tier?: number;
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
  itemRarity: number;
}

export interface Forge {
  pack: Pack;
  settings: ForgeSettings;
  reseed(seed: number): void;

  generateItem(opts?: { ilvl?: number; formId?: string; materialId?: string; brands?: number; rarity?: Rarity; itemRarity?: number }): Item;
  materialPoolFor(form: string | FormDef, ilvl: number): Array<{ w: number; id: string }>;
  /** Drop rarity odds for a given % increased Item Rarity (provisional). */
  rarityOdds(itemRarity?: number): Record<Rarity, number>;
  itemRarityOf(items: Array<Item | null>, ctx?: AggregateCtx): number;

  addModifier(item: Item, opts?: { pigmentId?: string; omenId?: string }): OpResult;
  upgradeToRare(item: Item, opts?: { pigmentId?: string; omenId?: string }): OpResult;
  rerollValues(item: Item): OpResult;
  removeLastModifier(item: Item): OpResult;
  explainOdds(item: Item, opts?: { pigmentId?: string; omenId?: string }): OddsEntry[];

  attune(item: Item, xp: number, themeWeights: Record<string, number>, ctx: AggregateCtx): { item: Item; events: GameEvent[] };
  isSated(item: Item): boolean;

  addFragment(stash: Record<string, number>, trophyId: string): { stash: Record<string, number>; completed: boolean; event: GameEvent } | { error: string };
  socketTrophy(item: Item, trophyId: string, stash: Record<string, number>): { item: Item; stash: Record<string, number>; event: GameEvent } | { error: string };

  createCharacter(opts?: { name?: string; archetype?: string; gold?: number }): Character;
  charLevel(c: Character): number;
  venture(character: Character, equipment: Record<string, Item | null>, opts?: { encounter?: Encounter; itemRarity?: number }): VentureResult;

  aggregate(items: Array<Item | null>, ctx?: AggregateCtx): {
    sums: Record<string, number>;
    sheet: Record<string, number>;
    conditionals: Conditional[];
  };
  tooltip(item: Item): TooltipLine[];
  sellValue(item: Item): number;
  displayName(item: Item): string;
  rarityName(item: Item): string;
  dominantBondTheme(item: Item): string | null;
  bondValue(bond: Bond): number;
  freeSlots(item: Item): number;
  isCraftable(item: Item): boolean;
  canAddBrand(item: Item): boolean;
  canAddBond(item: Item): boolean;

  /** Loads an item from an older save: strips removed fields, assigns rarity. */
  normalizeItem(item: unknown): Item;
  serialize(state: unknown): string;
  deserialize(raw: string): unknown;
}

export function createForge(pack: Pack, opts?: { seed?: number }): Forge;
export function validatePack(pack: Pack): string[];
export const version: string;
