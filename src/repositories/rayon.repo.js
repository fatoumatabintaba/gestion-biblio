// src/repositories/rayon.repo.js
import prisma from '../config/db.js';

export const rayonRepo = {
  findAll: () =>
    prisma.rayon.findMany({ orderBy: { code: 'asc' } }),

  findById: (id) =>
    prisma.rayon.findUnique({ where: { id }, include: { livres: true } }),

  findByCodeEtSousRayon: (code, sousRayon) =>
    prisma.rayon.findFirst({
      where: { code, sousRayon: sousRayon ?? null },
    }),

  create: (data) =>
    prisma.rayon.create({ data }),

  update: (id, data) =>
    prisma.rayon.update({ where: { id }, data }),

  delete: (id) =>
    prisma.rayon.delete({ where: { id } }),

  countLivres: (id) =>
    prisma.livre.count({ where: { rayonId: id } }),
};