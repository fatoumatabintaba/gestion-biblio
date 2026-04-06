// src/validations/adherent.schema.js
import { z } from 'zod';

export const createAdherentSchema = z.object({
  prenom: z
    .string({ required_error: 'Le prénom est obligatoire' })
    .min(2, 'Le prénom doit comporter au moins 2 caractères'),
  nom: z
    .string({ required_error: 'Le nom est obligatoire' })
    .min(2, 'Le nom doit comporter au moins 2 caractères'),
  email: z
    .string({ required_error: "L'email est obligatoire" })
    .email("Format d'email invalide"),
  telephone: z
    .string({ required_error: 'Le téléphone est obligatoire' })
    .regex(/^\+?[\d\s\-]{6,}$/, 'Le téléphone doit comporter au moins 6 chiffres'),
  dateInscription: z
    .string({ required_error: "La date d'inscription est obligatoire" })
    .refine((val) => {
      const date = new Date(val);
      return !isNaN(date.getTime()) && date <= new Date();
    }, "La date d'inscription doit être une date valide et ne peut pas être dans le futur"),
});

export const updateAdherentSchema = createAdherentSchema.partial();
