/**
 * Taille affichée d'un token sur ce client : `getSize()` × le facteur que dnd5e applique à l'image (créature Petite).
 * Détail et conditions : `core/token-size.mjs`.
 */

import { displayedSize, dnd5eSizeScale } from "../core/token-size.mjs";

/**
 * @param {Token} token
 * @returns {{width: number, height: number}}
 */
export function tokenDisplaySize(token) {
  const doc = token.document;
  const scale = dnd5eSizeScale(doc, {
    sizeSync: !!globalThis.dnd5e?.settings?.tokenSizeSync,
    actorSizes: CONFIG.DND5E?.actorSizes
  });
  return displayedSize(doc.getSize(), scale);
}
