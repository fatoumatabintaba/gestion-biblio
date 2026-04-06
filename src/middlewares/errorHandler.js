// src/middlewares/errorHandler.js
import { error } from '../utils/response.js';

const errorHandler = (err, req, res, next) => {
  console.error('[ErrorHandler]', err);

  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return error(res, 'Image trop volumineuse. La taille maximale autorisée est de 2 Mo.', 400);
    }

    return error(res, err.message || 'Erreur lors de l\'upload du fichier', 400);
  }

  // Erreurs Prisma connues
  if (err.code === 'P2002') {
    const field = err.meta?.target?.join(', ') || 'champ';
    return error(res, `Valeur déjà existante sur le champ : ${field}`, 409);
  }
  if (err.code === 'P2003') {
    return error(res, 'Opération impossible à cause d\'une relation encore utilisée en base de données.', 409);
  }
  if (err.code === 'P2025') {
    return error(res, 'Enregistrement introuvable', 404);
  }

  return error(res, err.message || 'Erreur interne du serveur', err.statusCode || 500);
};

export default errorHandler;
