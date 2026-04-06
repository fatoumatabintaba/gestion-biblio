// src/controllers/emprunt.controller.js
import { empruntService } from '../services/emprunt.service.js';
import { success, created } from '../utils/response.js';

export const empruntController = {
  getAll: async (req, res, next) => {
    try {
      const emprunts = await empruntService.getAll();
      return success(res, emprunts, 'Liste des emprunts récupérée avec succès');
    } catch (err) {
      next(err);
    }
  },

  getById: async (req, res, next) => {
    try {
      const emprunt = await empruntService.getById(req.params.id);
      return success(res, emprunt, 'Emprunt récupéré avec succès');
    } catch (err) {
      next(err);
    }
  },

  create: async (req, res, next) => {
    try {
      const emprunt = await empruntService.create(req.body);
      return created(res, emprunt, 'Emprunt enregistré avec succès');
    } catch (err) {
      next(err);
    }
  },

  retourner: async (req, res, next) => {
    try {
      const emprunt = await empruntService.retourner(req.params.id);
      return success(res, emprunt, 'Retour enregistré avec succès');
    } catch (err) {
      next(err);
    }
  },

  marquerEnRetard: async (req, res, next) => {
    try {
      const emprunt = await empruntService.marquerEnRetard(req.params.id);
      return success(res, emprunt, 'Emprunt marqué EN_RETARD avec succès');
    } catch (err) {
      next(err);
    }
  },
};
