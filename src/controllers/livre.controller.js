// src/controllers/livre.controller.js
import { livreService } from '../services/livre.service.js';
import { success, created } from '../utils/response.js';

export const livreController = {
  getAll: async (req, res, next) => {
    try {
      const livres = await livreService.getAll();
      return success(res, livres, 'Liste des livres récupérée avec succès');
    } catch (err) {
      next(err);
    }
  },

  getById: async (req, res, next) => {
    try {
      const livre = await livreService.getById(req.params.id);
      return success(res, livre, 'Livre récupéré avec succès');
    } catch (err) {
      next(err);
    }
  },

  create: async (req, res, next) => {
    try {
      const livre = await livreService.create(req.body, req.file);
      return created(res, livre, 'Livre enregistré avec succès');
    } catch (err) {
      next(err);
    }
  },

  update: async (req, res, next) => {
    try {
      const livre = await livreService.update(req.params.id, req.body, req.file);
      return success(res, livre, 'Livre mis à jour avec succès');
    } catch (err) {
      next(err);
    }
  },

  delete: async (req, res, next) => {
    try {
      await livreService.delete(req.params.id);
      return success(res, null, 'Livre supprimé avec succès');
    } catch (err) {
      next(err);
    }
  },
};
