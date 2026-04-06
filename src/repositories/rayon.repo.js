// src/repositories/rayon.repo.js
import prisma from '../config/db.js';

const rayonWithLivresSelect = {
  id: true,
  code: true,
  libelle: true,
  localisation: true,
  sousRayon: true,
  createdAt: true,
  updatedAt: true,
  livres: {
    select: {
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
    },
  },
};

export const rayonRepo = {
  findAll: () => prisma.rayon.findMany({ orderBy: [{ code: 'asc' }, { sousRayon: 'asc' }] }),

  findById: (id) => prisma.rayon.findUnique({ where: { id }, select: rayonWithLivresSelect }),

  findByCodeAndSousRayon: (code, sousRayon = '') =>
    prisma.rayon.findFirst({ where: { code, sousRayon } }),

  create: (data) => prisma.rayon.create({ data }),

  update: (id, data) => prisma.rayon.update({ where: { id }, data }),

  delete: (id) => prisma.rayon.delete({ where: { id } }),

  countLivres: (id) => prisma.livre.count({ where: { rayonId: id } }),
};
