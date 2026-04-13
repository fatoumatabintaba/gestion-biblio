// src/services/rayon.service.js
import { rayonRepo } from '../repositories/rayon.repo.js';

export const rayonService = {
  getAll: async () => rayonRepo.findAll(),

  getById: async (id) => {
    const rayon = await rayonRepo.findById(id);
    if (!rayon) {
      const err = new Error('Rayon introuvable');
      err.statusCode = 404;
      throw err;
    }
    return rayon;
  },

  create: async (data) => {
    const existing = await rayonRepo.findByCodeEtSousRayon(data.code, data.sousRayon ?? null);
    if (existing) {
      const label = data.sousRayon
        ? `Le rayon "${data.code}" / sous-rayon "${data.sousRayon}" existe déjà`
        : `Le code rayon "${data.code}" existe déjà (sans sous-rayon)`;
      const err = new Error(label);
      err.statusCode = 409;
      throw err;
    }
    return rayonRepo.create({ ...data, sousRayon: data.sousRayon ?? null });
  },

  update: async (id, data) => {
    const rayon = await rayonRepo.findById(id);
    if (!rayon) {
      const err = new Error('Rayon introuvable');
      err.statusCode = 404;
      throw err;
    }
    const newCode = data.code ?? rayon.code;
    const newSousRayon = Object.prototype.hasOwnProperty.call(data, 'sousRayon')
      ? (data.sousRayon ?? null)
      : rayon.sousRayon;

    if (newCode !== rayon.code || newSousRayon !== rayon.sousRayon) {
      const existing = await rayonRepo.findByCodeEtSousRayon(newCode, newSousRayon);
      if (existing && existing.id !== rayon.id) {
        const label = newSousRayon
          ? `Le rayon "${newCode}" / sous-rayon "${newSousRayon}" existe déjà`
          : `Le code rayon "${newCode}" existe déjà (sans sous-rayon)`;
        const err = new Error(label);
        err.statusCode = 409;
        throw err;
      }
    }
    return rayonRepo.update(id, data);
  },

  delete: async (id) => {
    const rayon = await rayonRepo.findById(id);
    if (!rayon) {
      const err = new Error('Rayon introuvable');
      err.statusCode = 404;
      throw err;
    }
    const nbLivres = await rayonRepo.countLivres(id);
    if (nbLivres > 0) {
      const err = new Error(
        `Impossible de supprimer ce rayon : il contient ${nbLivres} livre(s).`
      );
      err.statusCode = 403;
      throw err;
    }
    return rayonRepo.delete(id);
  },
};