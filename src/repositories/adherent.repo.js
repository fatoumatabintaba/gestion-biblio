// src/repositories/adherent.repo.js
import prisma from '../config/db.js';

export const adherentRepo = {
  findAll: () =>
    prisma.adherent.findMany({ orderBy: { nom: 'asc' } }),

  findById: (id) =>
    prisma.adherent.findUnique({ where: { id } }),

  findByEmail: (email) =>
    prisma.adherent.findUnique({ where: { email } }),

  findLastMatricule: () =>
    prisma.adherent.findFirst({
      orderBy: { id: 'desc' },
      select: { matricule: true },
    }),

  create: (data) =>
    prisma.adherent.create({ data }),

  update: (id, data) =>
    prisma.adherent.update({ where: { id }, data }),

  delete: (id) =>
    prisma.adherent.delete({ where: { id } }),

  countEmpruntsEnCours: (id) =>
    prisma.emprunt.count({ where: { adherentId: id, statut: 'EN_COURS' } }),
};