// src/controllers/rayon.controller.js
import { rayonService } from '../services/rayon.service.js';
import { success, created, notFound } from '../utils/response.js';

export const rayonController = {
  getAll: async (req, res, next) => {
    try {
      const rayons = await rayonService.getAll();
      return success(res, rayons, 'Liste des rayons récupérée avec succès');
    } catch (err) {
      next(err);
    }
  },

  getById: async (req, res, next) => {
    try {
      const rayon = await rayonService.getById(req.params.id);
      return success(res, rayon, 'Rayon récupéré avec succès');
    } catch (err) {
      next(err);
    }
  },

  create: async (req, res, next) => {
    try {
      const rayon = await rayonService.create(req.body);
      return created(res, rayon, 'Rayon créé avec succès');
    } catch (err) {
      next(err);
    }
  },

  update: async (req, res, next) => {
    try {
      const rayon = await rayonService.update(req.params.id, req.body);
      return success(res, rayon, 'Rayon mis à jour avec succès');
    } catch (err) {
      next(err);
    }
  },

  delete: async (req, res, next) => {
    try {
      await rayonService.delete(req.params.id);
      return success(res, null, 'Rayon supprimé avec succès');
    } catch (err) {
      next(err);
    }
  },
};
