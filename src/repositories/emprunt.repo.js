// src/repositories/emprunt.repo.js
import prisma from '../config/db.js';

export const empruntRepo = {
  findAll: () =>
    prisma.emprunt.findMany({
      include: {
        adherent: { select: { id: true, prenom: true, nom: true, email: true } },
        livre: { select: { id: true, titre: true, isbn: true } },
      },
      orderBy: { dateEmprunt: 'desc' },
    }),

  findById: (id) =>
    prisma.emprunt.findUnique({
      where: { id },
      include: {
        adherent: { select: { id: true, prenom: true, nom: true, email: true } },
        livre: { select: { id: true, titre: true, isbn: true } },
      },
    }),

  findEnCoursParAdherentEtLivre: (adherentId, livreId) =>
    prisma.emprunt.findFirst({
      where: { adherentId, livreId, statut: 'EN_COURS' },
    }),

  findByAdherent: (adherentId) =>
    prisma.emprunt.findMany({
      where: { adherentId },
      include: { livre: { select: { id: true, titre: true, isbn: true } } },
      orderBy: { dateEmprunt: 'desc' },
    }),

  create: (data) =>
    prisma.emprunt.create({
      data,
      include: {
        adherent: { select: { id: true, prenom: true, nom: true } },
        livre: { select: { id: true, titre: true, isbn: true } },
      },
    }),

  updateStatut: (id, statut) =>
    prisma.emprunt.update({
      where: { id },
      data: { statut },
      include: {
        adherent: { select: { id: true, prenom: true, nom: true } },
        livre: { select: { id: true, titre: true, isbn: true } },
      },
    }),
};
