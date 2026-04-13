// src/services/adherent.service.js
import { adherentRepo } from '../repositories/adherent.repo.js';
import { deleteCloudinaryImage } from '../config/cloudinary.js';

const genererMatricule = async () => {
  const annee = new Date().getFullYear();
  const dernier = await adherentRepo.findLastMatricule();
  let seq = 1;
  if (dernier?.matricule) {
    const num = parseInt(dernier.matricule.split('-')[2], 10);
    if (!isNaN(num)) seq = num + 1;
  }
  return `ADH-${annee}-${String(seq).padStart(4, '0')}`;
};

export const adherentService = {
  getAll: async () => adherentRepo.findAll(),

  getById: async (id) => {
    const adherent = await adherentRepo.findById(id);
    if (!adherent) {
      const err = new Error('Adhérent introuvable');
      err.statusCode = 404;
      throw err;
    }
    return adherent;
  },

  create: async (data, photoUrl = null) => {
    const existing = await adherentRepo.findByEmail(data.email);
    if (existing) {
      const err = new Error(`Un adhérent avec l'email "${data.email}" existe déjà`);
      err.statusCode = 409;
      throw err;
    }
    const matricule = await genererMatricule();
    return adherentRepo.create({
      ...data,
      matricule,
      photo: photoUrl,
      dateInscription: new Date(data.dateInscription),
    });
  },

  update: async (id, data) => {
    const adherent = await adherentRepo.findById(id);
    if (!adherent) {
      const err = new Error('Adhérent introuvable');
      err.statusCode = 404;
      throw err;
    }
    if (data.email && data.email !== adherent.email) {
      const existing = await adherentRepo.findByEmail(data.email);
      if (existing) {
        const err = new Error(`Un adhérent avec l'email "${data.email}" existe déjà`);
        err.statusCode = 409;
        throw err;
      }
    }
    // matricule non modifiable — on l'exclut même s'il est envoyé
    const { matricule, photo, ...updateData } = data;
    if (updateData.dateInscription) {
      updateData.dateInscription = new Date(updateData.dateInscription);
    }
    return adherentRepo.update(id, updateData);
  },

  updatePhoto: async (id, photoUrl) => {
    const adherent = await adherentRepo.findById(id);
    if (!adherent) {
      const err = new Error('Adhérent introuvable');
      err.statusCode = 404;
      throw err;
    }
    await deleteCloudinaryImage(adherent.photo);
    return adherentRepo.update(id, { photo: photoUrl });
  },

  delete: async (id) => {
    const adherent = await adherentRepo.findById(id);
    if (!adherent) {
      const err = new Error('Adhérent introuvable');
      err.statusCode = 404;
      throw err;
    }
    const nbEmprunts = await adherentRepo.countEmpruntsEnCours(id);
    if (nbEmprunts > 0) {
      const err = new Error(
        `Impossible de supprimer cet adhérent : il a ${nbEmprunts} emprunt(s) en cours.`
      );
      err.statusCode = 403;
      throw err;
    }
    await deleteCloudinaryImage(adherent.photo);
    return adherentRepo.delete(id);
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