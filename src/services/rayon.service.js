// src/services/rayon.service.js
import { rayonRepo } from '../repositories/rayon.repo.js';

const normalizeSousRayon = (value) => {
  if (typeof value !== 'string') {
    return '';
  }

  const trimmedValue = value.trim();
  return trimmedValue || '';
};

export const rayonService = {
  getAll: async () => {
    return rayonRepo.findAll();
  },

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
    const payload = {
      ...data,
      sousRayon: normalizeSousRayon(data.sousRayon),
    };

    const existing = await rayonRepo.findByCodeAndSousRayon(payload.code, payload.sousRayon);
    if (existing) {
      const suffix = payload.sousRayon ? ` / sous-rayon "${payload.sousRayon}"` : '';
      const err = new Error(`Le couple code "${payload.code}"${suffix} existe déjà`);
      err.statusCode = 409;
      throw err;
    }

    return rayonRepo.create(payload);
  },

  update: async (id, data) => {
    const rayon = await rayonRepo.findById(id);
    if (!rayon) {
      const err = new Error('Rayon introuvable');
      err.statusCode = 404;
      throw err;
    }
    const nextCode = data.code ?? rayon.code;
    const nextSousRayon = Object.prototype.hasOwnProperty.call(data, 'sousRayon')
      ? normalizeSousRayon(data.sousRayon)
      : normalizeSousRayon(rayon.sousRayon);

    if (nextCode !== rayon.code || nextSousRayon !== normalizeSousRayon(rayon.sousRayon)) {
      const existing = await rayonRepo.findByCodeAndSousRayon(nextCode, nextSousRayon);
      if (existing && existing.id !== rayon.id) {
        const suffix = nextSousRayon ? ` / sous-rayon "${nextSousRayon}"` : '';
        const err = new Error(`Le couple code "${nextCode}"${suffix} existe déjà`);
        err.statusCode = 409;
        throw err;
      }
    }

    return rayonRepo.update(id, {
      ...data,
      ...(Object.prototype.hasOwnProperty.call(data, 'sousRayon')
        ? { sousRayon: nextSousRayon }
        : {}),
    });
  },

  delete: async (id) => {
    const rayon = await rayonRepo.findById(id);
    if (!rayon) {
      const err = new Error('Rayon introuvable');
      err.statusCode = 404;
      throw err;
    }
    // Interdire suppression si des livres existent dans ce rayon
    const nbLivres = await rayonRepo.countLivres(id);
    if (nbLivres > 0) {
      const err = new Error(
        `Impossible de supprimer ce rayon : il contient ${nbLivres} livre(s). Veuillez d'abord retirer ou réaffecter les livres.`
      );
      err.statusCode = 403;
      throw err;
    }
    return rayonRepo.delete(id);
  },
};
