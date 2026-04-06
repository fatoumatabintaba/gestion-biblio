// src/utils/response.js

export const success = (res, data, message = 'Succès', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const created = (res, data, message = 'Ressource créée avec succès') => {
  return success(res, data, message, 201);
};

export const error = (res, message = 'Erreur serveur', statusCode = 500, details = null) => {
  const payload = { success: false, message };
  if (details) payload.details = details;
  return res.status(statusCode).json(payload);
};

export const badRequest = (res, message, details = null) => error(res, message, 400, details);
export const notFound = (res, message = 'Ressource introuvable') => error(res, message, 404);
export const conflict = (res, message) => error(res, message, 409);
export const forbidden = (res, message) => error(res, message, 403);
