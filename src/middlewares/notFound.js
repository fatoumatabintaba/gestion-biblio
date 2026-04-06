// src/middlewares/notFound.js
import { notFound } from '../utils/response.js';

const notFoundMiddleware = (req, res) => {
  return notFound(res, `Route introuvable : ${req.method} ${req.originalUrl}`);
};

export default notFoundMiddleware;
