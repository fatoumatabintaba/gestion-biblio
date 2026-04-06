// src/services/adherent.service.js
import { adherentRepo } from '../repositories/adherent.repo.js';
import { cloudinaryService } from './cloudinary.service.js';
import { buildAdherentMatricule } from '../utils/matricule.js';

const isMatriculeUniqueConflict = (error) =>
  error?.code === 'P2002' && Array.isArray(error.meta?.target) && error.meta.target.includes('matricule');

export const adherentService = {
  getAll: async () => {
    return adherentRepo.findAll();
  },

  getById: async (id) => {
    const adherent = await adherentRepo.findById(id);
    if (!adherent) {
      const err = new Error('Adhérent introuvable');
      err.statusCode = 404;
      throw err;
    }
    return adherent;
  },

  create: async (data, file) => {
    let uploadedPhoto = null;

    // Vérifier unicité de l'email
    const existing = await adherentRepo.findByEmail(data.email);
    if (existing) {
      const err = new Error(`Un adhérent avec l'email "${data.email}" existe déjà`);
      err.statusCode = 409;
      throw err;
    }

    try {
      uploadedPhoto = await cloudinaryService.uploadImage(file, 'bibliotheque/adherents');
      const currentYear = new Date().getFullYear();

      for (let attempt = 0; attempt < 3; attempt += 1) {
        const lastMatricule = await adherentRepo.findLastMatriculeForYear(currentYear);
        const matricule = buildAdherentMatricule(lastMatricule?.matricule, currentYear);

        try {
          return await adherentRepo.create({
            prenom: data.prenom,
            nom: data.nom,
            email: data.email,
            telephone: data.telephone,
            dateInscription: new Date(data.dateInscription),
            matricule,
            photo: uploadedPhoto?.url || null,
            photoPublicId: uploadedPhoto?.publicId || null,
          });
        } catch (err) {
          if (!isMatriculeUniqueConflict(err) || attempt === 2) {
            throw err;
          }
        }
      }
    } catch (err) {
      if (uploadedPhoto?.publicId) {
        await cloudinaryService.deleteImage(uploadedPhoto.publicId).catch(() => null);
      }
      throw err;
    }
  },

  update: async (id, data, file) => {
    const adherent = await adherentRepo.findByIdInternal(id);
    if (!adherent) {
      const err = new Error('Adhérent introuvable');
      err.statusCode = 404;
      throw err;
    }
    // Si email change, vérifier unicité
    if (data.email && data.email !== adherent.email) {
      const existing = await adherentRepo.findByEmail(data.email);
      if (existing) {
        const err = new Error(`Un adhérent avec l'email "${data.email}" existe déjà`);
        err.statusCode = 409;
        throw err;
      }
    }
    const updateData = { ...data };
    if (data.dateInscription) {
      updateData.dateInscription = new Date(data.dateInscription);
    }

    let uploadedPhoto = null;

    try {
      if (file) {
        uploadedPhoto = await cloudinaryService.uploadImage(file, 'bibliotheque/adherents');
        updateData.photo = uploadedPhoto.url;
        updateData.photoPublicId = uploadedPhoto.publicId;
      }

      const updatedAdherent = await adherentRepo.update(id, updateData);

      if (uploadedPhoto?.publicId && adherent.photoPublicId) {
        await cloudinaryService.deleteImage(adherent.photoPublicId).catch(() => null);
      }

      return updatedAdherent;
    } catch (err) {
      if (uploadedPhoto?.publicId) {
        await cloudinaryService.deleteImage(uploadedPhoto.publicId).catch(() => null);
      }
      throw err;
    }
  },

  delete: async (id) => {
    const adherent = await adherentRepo.findByIdInternal(id);
    if (!adherent) {
      const err = new Error('Adhérent introuvable');
      err.statusCode = 404;
      throw err;
    }
    // Interdire suppression si emprunts EN_COURS
    const nbEmprunts = await adherentRepo.countEmpruntsEnCours(id);
    if (nbEmprunts > 0) {
      const err = new Error(
        `Impossible de supprimer cet adhérent : il a ${nbEmprunts} emprunt(s) en cours.`
      );
      err.statusCode = 403;
      throw err;
    }

    const deletedAdherent = await adherentRepo.delete(id);

    if (adherent.photoPublicId) {
      await cloudinaryService.deleteImage(adherent.photoPublicId).catch(() => null);
    }

    return deletedAdherent;
  },

  getEmprunts: async (id) => {
    const adherent = await adherentRepo.findById(id);
    if (!adherent) {
      const err = new Error('Adhérent introuvable');
      err.statusCode = 404;
      throw err;
    }
    const { empruntRepo } = await import('../repositories/emprunt.repo.js');
    return empruntRepo.findByAdherent(id);
  },
};
