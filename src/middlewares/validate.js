// src/middlewares/validate.js
import { badRequest } from '../utils/response.js';

/**
 * Middleware générique de validation Zod
 * @param {ZodSchema} schema - schéma Zod à valider
 * @param {'body'|'params'|'query'} target - source de données à valider
 */
const validate = (schema, target = 'body') => (req, res, next) => {
  const result = schema.safeParse(req[target]);
  if (!result.success) {
    const details = result.error.errors.map((e) => ({
      champ: e.path.join('.'),
      message: e.message,
    }));
    return badRequest(res, 'Données invalides', details);
  }
  req[target] = result.data;
  next();
};

export default validate;
