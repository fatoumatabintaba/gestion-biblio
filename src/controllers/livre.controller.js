// src/controllers/livre.controller.js
import { livreService } from '../services/livre.service.js';
import { success, created } from '../utils/response.js';

export const livreController = {
  getAll: async (req, res, next) => {
    try {
      return success(res, await livreService.getAll(), 'Liste des livres récupérée avec succès');
    } catch (err) { next(err); }
  },

  getById: async (req, res, next) => {
    try {
      return success(res, await livreService.getById(req.params.id), 'Livre récupéré avec succès');
    } catch (err) { next(err); }
  },

  create: async (req, res, next) => {
    try {
      const couvertureUrl = req.file?.path ?? null;
      const livre = await livreService.create(req.body, couvertureUrl);
      return created(res, livre, 'Livre enregistré avec succès');
    } catch (err) { next(err); }
  },

  update: async (req, res, next) => {
    try {
      const livre = await livreService.update(req.params.id, req.body);
      return success(res, livre, 'Livre mis à jour avec succès');
    } catch (err) { next(err); }
  },

  updateCouverture: async (req, res, next) => {
    try {
      if (!req.file) {
        const err = new Error('Aucun fichier image fourni');
        err.statusCode = 400;
        throw err;
      }
      const livre = await livreService.updateCouverture(req.params.id, req.file.path);
      return success(res, livre, 'Couverture mise à jour avec succès');
    } catch (err) { next(err); }
  },

  delete: async (req, res, next) => {
    try {
      await livreService.delete(req.params.id);
      return success(res, null, 'Livre supprimé avec succès');
    } catch (err) { next(err); }
  },
};