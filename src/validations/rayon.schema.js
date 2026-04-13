// src/validations/rayon.schema.js
import { z } from 'zod';

export const createRayonSchema = z.object({
  code: z
    .string({ required_error: 'Le code est obligatoire' })
    .min(2, 'Le code doit comporter au moins 2 caractères')
    .regex(/^[A-Z0-9\-]+$/, 'Le code doit être en majuscules (ex: RAY-BD)'),
  libelle: z
    .string({ required_error: 'Le libellé est obligatoire' })
    .min(2, 'Le libellé doit comporter au moins 2 caractères'),
  localisation: z
    .string({ required_error: 'La localisation est obligatoire' })
    .min(2, 'La localisation doit comporter au moins 2 caractères'),
  sousRayon: z
    .string()
    .min(2, 'Le sous-rayon doit comporter au moins 2 caractères')
    .optional()
    .nullable(),
});

export const updateRayonSchema = createRayonSchema.partial();