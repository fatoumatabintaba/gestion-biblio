// src/services/livre.service.js
import { livreRepo } from '../repositories/livre.repo.js';
import { rayonRepo } from '../repositories/rayon.repo.js';
import { deleteCloudinaryImage } from '../config/cloudinary.js';

export const livreService = {
  getAll: async () => livreRepo.findAll(),

  getById: async (id) => {
    const livre = await livreRepo.findById(id);
    if (!livre) {
      const err = new Error('Livre introuvable');
      err.statusCode = 404;
      throw err;
    }
    return livre;
  },

  create: async (data, couvertureUrl = null) => {
    const rayon = await rayonRepo.findById(data.rayonId);
    if (!rayon) {
      const err = new Error(`Le rayon avec l'id ${data.rayonId} n'existe pas`);
      err.statusCode = 404;
      throw err;
    }
    const existing = await livreRepo.findByIsbn(data.isbn);
    if (existing) {
      const err = new Error(`Un livre avec l'ISBN "${data.isbn}" existe déjà`);
      err.statusCode = 409;
      throw err;
    }
    return livreRepo.create({ ...data, couverture: couvertureUrl });
  },

  update: async (id, data) => {
    const livre = await livreRepo.findById(id);
    if (!livre) {
      const err = new Error('Livre introuvable');
      err.statusCode = 404;
      throw err;
    }
    if (data.rayonId && data.rayonId !== livre.rayonId) {
      const rayon = await rayonRepo.findById(data.rayonId);
      if (!rayon) {
        const err = new Error(`Le rayon avec l'id ${data.rayonId} n'existe pas`);
        err.statusCode = 404;
        throw err;
      }
    }
    if (data.isbn && data.isbn !== livre.isbn) {
      const existing = await livreRepo.findByIsbn(data.isbn);
      if (existing) {
        const err = new Error(`Un livre avec l'ISBN "${data.isbn}" existe déjà`);
        err.statusCode = 409;
        throw err;
      }
    }
    return livreRepo.update(id, data);
  },

  updateCouverture: async (id, couvertureUrl) => {
    const livre = await livreRepo.findById(id);
    if (!livre) {
      const err = new Error('Livre introuvable');
      err.statusCode = 404;
      throw err;
    }
    await deleteCloudinaryImage(livre.couverture);
    return livreRepo.update(id, { couverture: couvertureUrl });
  },

  delete: async (id) => {
    const livre = await livreRepo.findById(id);
    if (!livre) {
      const err = new Error('Livre introuvable');
      err.statusCode = 404;
      throw err;
    }
    const nbEmprunts = await livreRepo.countEmpruntsEnCours(id);
    if (nbEmprunts > 0) {
      const err = new Error(
        `Impossible de supprimer ce livre : il a ${nbEmprunts} emprunt(s) en cours.`
      );
      err.statusCode = 403;
      throw err;
    }
    await deleteCloudinaryImage(livre.couverture);
    return livreRepo.delete(id);
  },
};