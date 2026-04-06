// src/repositories/livre.repo.js
import prisma from '../config/db.js';

const livrePublicSelect = {
  id: true,
  titre: true,
  auteur: true,
  isbn: true,
  anneePublication: true,
  qteDisponible: true,
  couverture: true,
  rayonId: true,
  createdAt: true,
  updatedAt: true,
  rayon: {
    select: {
      code: true,
      libelle: true,
      sousRayon: true,
    },
  },
};

export const livreRepo = {
  findAll: () =>
    prisma.livre.findMany({ select: livrePublicSelect, orderBy: { titre: 'asc' } }),

  findById: (id) => prisma.livre.findUnique({ where: { id }, select: livrePublicSelect }),

  findByIdInternal: (id) => prisma.livre.findUnique({ where: { id } }),

  findByIsbn: (isbn) => prisma.livre.findUnique({ where: { isbn } }),

  create: (data) => prisma.livre.create({ data, select: livrePublicSelect }),

  update: (id, data) => prisma.livre.update({ where: { id }, data, select: livrePublicSelect }),

  delete: (id) => prisma.livre.delete({ where: { id } }),

  decrementQte: (id) =>
    prisma.livre.update({ where: { id }, data: { qteDisponible: { decrement: 1 } } }),

  incrementQte: (id) =>
    prisma.livre.update({ where: { id }, data: { qteDisponible: { increment: 1 } } }),

  countEmpruntsEnCours: (id) =>
    prisma.emprunt.count({ where: { livreId: id, statut: 'EN_COURS' } }),
};
