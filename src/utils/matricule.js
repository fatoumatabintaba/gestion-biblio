// src/utils/matricule.js

export const buildAdherentMatricule = (lastMatricule, year = new Date().getFullYear()) => {
  const prefix = `ADH-${year}-`;

  if (!lastMatricule || !lastMatricule.startsWith(prefix)) {
    return `${prefix}0001`;
  }

  const lastSequence = Number.parseInt(lastMatricule.split('-')[2], 10);
  const nextSequence = Number.isNaN(lastSequence) ? 1 : lastSequence + 1;

  return `${prefix}${String(nextSequence).padStart(4, '0')}`;
};
