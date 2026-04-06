// src/controllers/adherent.controller.js
import { adherentService } from '../services/adherent.service.js';
import { success, created } from '../utils/response.js';

export const adherentController = {
  getAll: async (req, res, next) => {
    try {
      const adherents = await adherentService.getAll();
      return success(res, adherents, 'Liste des adhérents récupérée avec succès');
    } catch (err) {
      next(err);
    }
  },

  getById: async (req, res, next) => {
    try {
      const adherent = await adherentService.getById(req.params.id);
      return success(res, adherent, 'Adhérent récupéré avec succès');
    } catch (err) {
      next(err);
    }
  },

  create: async (req, res, next) => {
    try {
      const adherent = await adherentService.create(req.body, req.file);
      return created(res, adherent, 'Adhérent inscrit avec succès');
    } catch (err) {
      next(err);
    }
  },

  update: async (req, res, next) => {
    try {
      const adherent = await adherentService.update(req.params.id, req.body, req.file);
      return success(res, adherent, 'Adhérent mis à jour avec succès');
    } catch (err) {
      next(err);
    }
  },

  delete: async (req, res, next) => {
    try {
      await adherentService.delete(req.params.id);
      return success(res, null, 'Adhérent supprimé avec succès');
    } catch (err) {
      next(err);
    }
  },

  getEmprunts: async (req, res, next) => {
    try {
      const emprunts = await adherentService.getEmprunts(req.params.id);
      return success(res, emprunts, 'Emprunts de l\'adhérent récupérés avec succès');
    } catch (err) {
      next(err);
    }
  },
};
