// src/controllers/adherent.controller.js
import { adherentService } from '../services/adherent.service.js';
import { cloudinaryService } from '../services/cloudinary.service.js';
import { success, created } from '../utils/response.js';

export const adherentController = {
  getAll: async (req, res, next) => {
    try {
      return success(res, await adherentService.getAll(), 'Liste des adhérents récupérée avec succès');
    } catch (err) { next(err); }
  },

  getById: async (req, res, next) => {
    try {
      return success(res, await adherentService.getById(req.params.id), 'Adhérent récupéré avec succès');
    } catch (err) { next(err); }
  },

  create: async (req, res, next) => {
    try {
      const photoUpload = await cloudinaryService.uploadImage(req.file, 'adherents');
      const photoUrl = photoUpload?.url ?? null;
      const adherent = await adherentService.create(req.body, photoUrl);
      return created(res, adherent, 'Adhérent inscrit avec succès');
    } catch (err) { next(err); }
  },

  update: async (req, res, next) => {
    try {
      const adherent = await adherentService.update(req.params.id, req.body);
      return success(res, adherent, 'Adhérent mis à jour avec succès');
    } catch (err) { next(err); }
  },

  updatePhoto: async (req, res, next) => {
    try {
      if (!req.file) {
        const err = new Error('Aucun fichier image fourni');
        err.statusCode = 400;
        throw err;
      }
      const photoUpload = await cloudinaryService.uploadImage(req.file, 'adherents');
      const adherent = await adherentService.updatePhoto(req.params.id, photoUpload.url);
      return success(res, adherent, 'Photo mise à jour avec succès');
    } catch (err) { next(err); }
  },

  delete: async (req, res, next) => {
    try {
      await adherentService.delete(req.params.id);
      return success(res, null, 'Adhérent supprimé avec succès');
    } catch (err) { next(err); }
  },

  getEmprunts: async (req, res, next) => {
    try {
      const emprunts = await adherentService.getEmprunts(req.params.id);
      return success(res, emprunts, "Emprunts de l'adhérent récupérés avec succès");
    } catch (err) { next(err); }
  },
};
