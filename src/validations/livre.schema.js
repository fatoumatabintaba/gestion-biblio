// src/validations/livre.schema.js
import { z } from 'zod';

const anneeEnCours = new Date().getFullYear();

export const createLivreSchema = z.object({
  titre: z
    .string({ required_error: 'Le titre est obligatoire' })
    .min(2, 'Le titre doit comporter au moins 2 caractères'),
  auteur: z
    .string({ required_error: "L'auteur est obligatoire" })
    .min(2, "L'auteur doit comporter au moins 2 caractères"),
  isbn: z
    .string({ required_error: "L'ISBN est obligatoire" })
    .min(10, "L'ISBN doit comporter au moins 10 caractères"),
  anneePublication: z
    .coerce.number({ required_error: "L'année de publication est obligatoire", invalid_type_error: "L'année doit être un nombre entier" })
    .int("L'année doit être un entier")
    .max(anneeEnCours, `L'année de publication ne peut pas dépasser ${anneeEnCours}`),
  qteDisponible: z
    .coerce.number({ required_error: 'La quantité disponible est obligatoire', invalid_type_error: 'La quantité doit être un nombre entier' })
    .int('La quantité doit être un entier')
    .min(0, 'La quantité disponible doit être >= 0'),
  rayonId: z
    .coerce.number({ required_error: 'Le rayonId est obligatoire', invalid_type_error: 'Le rayonId doit être un nombre entier' })
    .int()
    .positive('Le rayonId doit être un entier positif'),
});

export const updateLivreSchema = createLivreSchema.partial();
