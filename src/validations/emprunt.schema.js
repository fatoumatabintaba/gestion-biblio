// src/validations/emprunt.schema.js
import { z } from 'zod';

export const createEmpruntSchema = z
  .object({
    adherentId: z
      .coerce.number({ required_error: "L'adherentId est obligatoire", invalid_type_error: "L'adherentId doit être un entier" })
      .int()
      .positive(),
    livreId: z
      .coerce.number({ required_error: 'Le livreId est obligatoire', invalid_type_error: 'Le livreId doit être un entier' })
      .int()
      .positive(),
    dateEmprunt: z
      .string({ required_error: "La date d'emprunt est obligatoire" })
      .refine((val) => {
        const date = new Date(val);
        return !isNaN(date.getTime()) && date <= new Date();
      }, "La date d'emprunt doit être valide et ≤ aujourd'hui"),
    dateRetourPrevue: z
      .string({ required_error: 'La date de retour prévue est obligatoire' })
      .refine((val) => !isNaN(new Date(val).getTime()), 'La date de retour prévue doit être valide'),
  })
  .refine(
    (data) => new Date(data.dateRetourPrevue) > new Date(data.dateEmprunt),
    { message: "La date de retour prévue doit être strictement supérieure à la date d'emprunt", path: ['dateRetourPrevue'] }
  );

export const retourEmpruntSchema = z.object({
  statut: z.enum(['RETOURNE'], { required_error: 'Le statut RETOURNE est requis pour un retour' }),
});
