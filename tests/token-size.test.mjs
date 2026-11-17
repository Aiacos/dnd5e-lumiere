import { describe, expect, it } from "vitest";
import { displayedSize, dnd5eSizeScale } from "../module/scripts/core/token-size.mjs";

// Table des tailles de dnd5e 6.1 (config.mjs) : seul Petit a un dynamicTokenScale.
const actorSizes = {
  tiny: { token: 0.5 },
  sm: { dynamicTokenScale: 0.8 },
  med: {},
  lg: { token: 2 },
  huge: { token: 3 },
  grg: { token: 4 }
};
const creature = (size, flags = {}) => ({ flags, actor: { system: { isCreature: true, traits: { size } } } });
const context = { sizeSync: true, actorSizes };

describe("dnd5eSizeScale", () => {
  it("créature Petite, réglage actif : 0,8 comme dnd5e", () => {
    expect(dnd5eSizeScale(creature("sm"), context)).toBe(0.8);
  });

  it("les autres tailles ne sont pas réduites", () => {
    for ( const size of ["tiny", "med", "lg", "huge", "grg"] ) expect(dnd5eSizeScale(creature(size), context)).toBe(1);
  });

  it("réglage dnd5e « synchroniser la taille » coupé : aucune réduction", () => {
    expect(dnd5eSizeScale(creature("sm"), { ...context, sizeSync: false })).toBe(1);
  });

  it("échelle du token verrouillée (flags.dnd5e.lockScale) : aucune réduction", () => {
    expect(dnd5eSizeScale(creature("sm", { dnd5e: { lockScale: true } }), context)).toBe(1);
  });

  it("acteur qui n'est pas une créature (véhicule, groupe) ou token sans acteur : aucune réduction", () => {
    expect(dnd5eSizeScale({ actor: { system: { isCreature: false, traits: { size: "sm" } } } }, context)).toBe(1);
    expect(dnd5eSizeScale({ flags: {} }, context)).toBe(1);
  });

  it("table des tailles absente ou valeur invalide : 1", () => {
    expect(dnd5eSizeScale(creature("sm"), { sizeSync: true })).toBe(1);
    expect(dnd5eSizeScale(creature("sm"), { sizeSync: true, actorSizes: { sm: { dynamicTokenScale: 0 } } })).toBe(1);
  });
});

describe("displayedSize", () => {
  it("multiplie la taille en cases par le facteur", () => {
    expect(displayedSize({ width: 100, height: 100 }, 0.8)).toEqual({ width: 80, height: 80 });
    expect(displayedSize({ width: 200, height: 100 })).toEqual({ width: 200, height: 100 });
  });
});
