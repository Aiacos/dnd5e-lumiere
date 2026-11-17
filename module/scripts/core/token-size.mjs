/**
 * Taille affichée d'un token : sa taille en cases (`TokenDocument#getSize`), réduite comme dnd5e réduit l'image.
 *
 * dnd5e 6 (`Token5e#_refreshMeshSizeAndScale`, canvas/token.mjs) multiplie l'échelle du mesh par
 * `CONFIG.DND5E.actorSizes[taille].dynamicTokenScale` (0,8 pour Petit, seule taille concernée) quand :
 * le réglage de monde `tokenSizeSync` est actif, l'acteur est une créature, et le token n'a pas
 * `flags.dnd5e.lockScale` (case « verrouiller l'échelle », cochée par la migration sur les anciens Petits sans anneau).
 * Une créature Petite occupe une case entière mais son image n'en couvre que 80 % : sans ce facteur, ses ombres
 * avaient la taille d'un Moyen (signalé sur le Discord DAS le 2026-11-17).
 *
 * L'échelle de l'image (`texture.scaleX/Y`) reste ignorée : l'ombre suit les cases, pas une illustration qui déborde.
 * Calcul pur sur les données du token ; le réglage et la table des tailles sont passés par l'appelant.
 */

/**
 * @param {object} doc                       Le TokenDocument (ou ses données) : `flags`, `actor`.
 * @param {object} context
 * @param {boolean} context.sizeSync          Réglage dnd5e `tokenSizeSync`.
 * @param {Record<string, {dynamicTokenScale?: number}>} [context.actorSizes]  `CONFIG.DND5E.actorSizes`.
 * @returns {number}  Facteur appliqué par dnd5e à l'image (1 s'il n'en applique aucun).
 */
export function dnd5eSizeScale(doc, { sizeSync, actorSizes } = {}) {
  const actor = doc?.actor;
  if ( !sizeSync || !actor?.system?.isCreature || doc?.flags?.dnd5e?.lockScale ) return 1;
  const scale = actorSizes?.[actor.system.traits?.size]?.dynamicTokenScale;
  return (Number.isFinite(scale) && (scale > 0)) ? scale : 1;
}

/**
 * @param {{width: number, height: number}} size  Taille du token en pixels (`getSize()`).
 * @param {number} scale                          Facteur de `dnd5eSizeScale`.
 * @returns {{width: number, height: number}}
 */
export function displayedSize({ width, height }, scale = 1) {
  return { width: width * scale, height: height * scale };
}
