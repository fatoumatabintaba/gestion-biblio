// src/repositories/adherent.repo.js
import prisma from '../config/db.js';

const adherentPublicSelect = {
  id: true,
  matricule: true,
  prenom: true,
  nom: true,
  email: true,
  telephone: true,
  dateInscription: true,
  photo: true,
  createdAt: true,
  updatedAt: true,
};

export const adherentRepo = {
  findAll: () => prisma.adherent.findMany({ select: adherentPublicSelect, orderBy: [{ nom: 'asc' }, { prenom: 'asc' }] }),

  findById: (id) => prisma.adherent.findUnique({ where: { id }, select: adherentPublicSelect }),

  findByIdInternal: (id) => prisma.adherent.findUnique({ where: { id } }),

  findByEmail: (email) => prisma.adherent.findUnique({ where: { email } }),

  findLastMatriculeForYear: (year) =>
    prisma.adherent.findFirst({
      where: {
        matricule: {
          startsWith: `ADH-${year}-`,
        },
      },
      orderBy: { matricule: 'desc' },
      select: { matricule: true },
    }),

  create: (data) => prisma.adherent.create({ data, select: adherentPublicSelect }),

  update: (id, data) => prisma.adherent.update({ where: { id }, data, select: adherentPublicSelect }),

  delete: (id) => prisma.adherent.delete({ where: { id } }),

  countEmpruntsEnCours: (id) =>
    prisma.emprunt.count({ where: { adherentId: id, statut: 'EN_COURS' } }),
};
