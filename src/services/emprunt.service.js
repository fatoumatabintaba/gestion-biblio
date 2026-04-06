// src/services/emprunt.service.js
import { empruntRepo } from '../repositories/emprunt.repo.js';
import { livreRepo } from '../repositories/livre.repo.js';
import { adherentRepo } from '../repositories/adherent.repo.js';

export const empruntService = {
  getAll: async () => {
    return empruntRepo.findAll();
  },

  getById: async (id) => {
    const emprunt = await empruntRepo.findById(id);
    if (!emprunt) {
      const err = new Error('Emprunt introuvable');
      err.statusCode = 404;
      throw err;
    }
    return emprunt;
  },

  create: async (data) => {
    // 1. Vérifier existence adhérent
    const adherent = await adherentRepo.findById(data.adherentId);
    if (!adherent) {
      const err = new Error(`L'adhérent avec l'id ${data.adherentId} n'existe pas`);
      err.statusCode = 404;
      throw err;
    }

    // 2. Vérifier existence livre
    const livre = await livreRepo.findById(data.livreId);
    if (!livre) {
      const err = new Error(`Le livre avec l'id ${data.livreId} n'existe pas`);
      err.statusCode = 404;
      throw err;
    }

    // 3. Vérifier stock disponible
    if (livre.qteDisponible < 1) {
      const err = new Error(
        `Emprunt refusé : le livre "${livre.titre}" n'a plus d'exemplaires disponibles.`
      );
      err.statusCode = 409;
      throw err;
    }

    // 4. Vérifier doublon EN_COURS pour (adherentId, livreId)
    const doublonEnCours = await empruntRepo.findEnCoursParAdherentEtLivre(
      data.adherentId,
      data.livreId
    );
    if (doublonEnCours) {
      const err = new Error(
        `Emprunt refusé : l'adhérent a déjà un emprunt EN_COURS pour le livre "${livre.titre}".`
      );
      err.statusCode = 409;
      throw err;
    }

    // 5. Décrémenter le stock
    await livreRepo.decrementQte(data.livreId);

    // 6. Créer l'emprunt
    return empruntRepo.create({
      adherentId: data.adherentId,
      livreId: data.livreId,
      dateEmprunt: new Date(data.dateEmprunt),
      dateRetourPrevue: new Date(data.dateRetourPrevue),
      statut: 'EN_COURS',
    });
  },

  retourner: async (id) => {
    const emprunt = await empruntRepo.findById(id);
    if (!emprunt) {
      const err = new Error('Emprunt introuvable');
      err.statusCode = 404;
      throw err;
    }
    if (emprunt.statut === 'RETOURNE') {
      const err = new Error('Cet emprunt a déjà été retourné.');
      err.statusCode = 409;
      throw err;
    }
    // Réincrémenter le stock
    await livreRepo.incrementQte(emprunt.livreId);
    // Passer le statut à RETOURNE
    return empruntRepo.updateStatut(id, 'RETOURNE');
  },

  marquerEnRetard: async (id) => {
    const emprunt = await empruntRepo.findById(id);
    if (!emprunt) {
      const err = new Error('Emprunt introuvable');
      err.statusCode = 404;
      throw err;
    }
    if (emprunt.statut !== 'EN_COURS') {
      const err = new Error('Seul un emprunt EN_COURS peut être marqué EN_RETARD.');
      err.statusCode = 409;
      throw err;
    }
    return empruntRepo.updateStatut(id, 'EN_RETARD');
  },
};
