// src/services/livre.service.js
import { livreRepo } from '../repositories/livre.repo.js';
import { rayonRepo } from '../repositories/rayon.repo.js';
import { cloudinaryService } from './cloudinary.service.js';

export const livreService = {
  getAll: async () => {
    return livreRepo.findAll();
  },

  getById: async (id) => {
    const livre = await livreRepo.findById(id);
    if (!livre) {
      const err = new Error('Livre introuvable');
      err.statusCode = 404;
      throw err;
    }
    return livre;
  },

  create: async (data, file) => {
    let uploadedCover = null;

    // Vérifier existence du rayon
    const rayon = await rayonRepo.findById(data.rayonId);
    if (!rayon) {
      const err = new Error(`Le rayon avec l'id ${data.rayonId} n'existe pas`);
      err.statusCode = 404;
      throw err;
    }
    // Vérifier unicité de l'ISBN
    const existing = await livreRepo.findByIsbn(data.isbn);
    if (existing) {
      const err = new Error(`Un livre avec l'ISBN "${data.isbn}" existe déjà`);
      err.statusCode = 409;
      throw err;
    }

    try {
      uploadedCover = await cloudinaryService.uploadImage(file, 'bibliotheque/livres');

      return await livreRepo.create({
        ...data,
        couverture: uploadedCover?.url || null,
        couverturePublicId: uploadedCover?.publicId || null,
      });
    } catch (err) {
      if (uploadedCover?.publicId) {
        await cloudinaryService.deleteImage(uploadedCover.publicId).catch(() => null);
      }
      throw err;
    }
  },

  update: async (id, data, file) => {
    const livre = await livreRepo.findByIdInternal(id);
    if (!livre) {
      const err = new Error('Livre introuvable');
      err.statusCode = 404;
      throw err;
    }
    // Si rayonId change, vérifier existence
    if (data.rayonId && data.rayonId !== livre.rayonId) {
      const rayon = await rayonRepo.findById(data.rayonId);
      if (!rayon) {
        const err = new Error(`Le rayon avec l'id ${data.rayonId} n'existe pas`);
        err.statusCode = 404;
        throw err;
      }
    }
    // Si ISBN change, vérifier unicité
    if (data.isbn && data.isbn !== livre.isbn) {
      const existing = await livreRepo.findByIsbn(data.isbn);
      if (existing) {
        const err = new Error(`Un livre avec l'ISBN "${data.isbn}" existe déjà`);
        err.statusCode = 409;
        throw err;
      }
    }

    let uploadedCover = null;

    try {
      if (file) {
        uploadedCover = await cloudinaryService.uploadImage(file, 'bibliotheque/livres');
      }

      const updatedLivre = await livreRepo.update(id, {
        ...data,
        ...(uploadedCover
          ? {
              couverture: uploadedCover.url,
              couverturePublicId: uploadedCover.publicId,
            }
          : {}),
      });

      if (uploadedCover?.publicId && livre.couverturePublicId) {
        await cloudinaryService.deleteImage(livre.couverturePublicId).catch(() => null);
      }

      return updatedLivre;
    } catch (err) {
      if (uploadedCover?.publicId) {
        await cloudinaryService.deleteImage(uploadedCover.publicId).catch(() => null);
      }
      throw err;
    }
  },

  delete: async (id) => {
    const livre = await livreRepo.findByIdInternal(id);
    if (!livre) {
      const err = new Error('Livre introuvable');
      err.statusCode = 404;
      throw err;
    }
    // Interdire suppression si emprunts EN_COURS
    const nbEmprunts = await livreRepo.countEmpruntsEnCours(id);
    if (nbEmprunts > 0) {
      const err = new Error(
        `Impossible de supprimer ce livre : il a ${nbEmprunts} emprunt(s) en cours.`
      );
      err.statusCode = 403;
      throw err;
    }

    const deletedLivre = await livreRepo.delete(id);

    if (livre.couverturePublicId) {
      await cloudinaryService.deleteImage(livre.couverturePublicId).catch(() => null);
    }

    return deletedLivre;
  },
};
