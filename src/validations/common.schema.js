// src/validations/common.schema.js
import { z } from 'zod';

export const idParamSchema = z.object({
  id: z.string().regex(/^\d+$/, 'L\'id doit être un entier positif').transform(Number),
});
