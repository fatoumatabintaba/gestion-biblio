// src/routes/livre.routes.js
import { Router } from 'express';
import { livreController } from '../controllers/livre.controller.js';
import validate from '../middlewares/validate.js';
import { uploadSingleImage } from '../middlewares/upload.js';
import { createLivreSchema, updateLivreSchema } from '../validations/livre.schema.js';
import { idParamSchema } from '../validations/common.schema.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Livres
 *   description: Gestion des livres de la bibliothèque
 */

/**
 * @swagger
 * /livres:
 *   get:
 *     summary: Lister tous les livres
 *     tags: [Livres]
 *     responses:
 *       200:
 *         description: Liste des livres récupérée avec succès
 */
router.get('/', livreController.getAll);

/**
 * @swagger
 * /livres/{id}:
 *   get:
 *     summary: Obtenir un livre par son ID
 *     tags: [Livres]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Livre trouvé
 *       404:
 *         description: Livre introuvable
 */
router.get('/:id', validate(idParamSchema, 'params'), livreController.getById);

/**
 * @swagger
 * /livres:
 *   post:
 *     summary: Enregistrer un nouveau livre
 *     tags: [Livres]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [titre, auteur, isbn, anneePublication, qteDisponible, rayonId]
 *             properties:
 *               titre:
 *                 type: string
 *                 example: Dune
 *               auteur:
 *                 type: string
 *                 example: Frank Herbert
 *               isbn:
 *                 type: string
 *                 example: 978-2-07-036822-8
 *               anneePublication:
 *                 type: integer
 *                 example: 1965
 *               qteDisponible:
 *                 type: integer
 *                 example: 3
 *               rayonId:
 *                 type: integer
 *                 example: 1
 *               couverture:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Livre enregistré avec succès
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Rayon introuvable
 *       409:
 *         description: ISBN déjà existant
 */
router.post('/', uploadSingleImage('couverture'), validate(createLivreSchema), livreController.create);

/**
 * @swagger
 * /livres/{id}:
 *   patch:
 *     summary: Mettre à jour un livre
 *     tags: [Livres]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               titre:
 *                 type: string
 *               auteur:
 *                 type: string
 *               isbn:
 *                 type: string
 *               anneePublication:
 *                 type: integer
 *               qteDisponible:
 *                 type: integer
 *               rayonId:
 *                 type: integer
 *               couverture:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Livre mis à jour
 *       404:
 *         description: Livre ou rayon introuvable
 *       409:
 *         description: ISBN déjà utilisé
 */
router.patch(
  '/:id',
  validate(idParamSchema, 'params'),
  uploadSingleImage('couverture'),
  validate(updateLivreSchema),
  livreController.update
);

/**
 * @swagger
 * /livres/{id}:
 *   delete:
 *     summary: Supprimer un livre
 *     tags: [Livres]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Livre supprimé avec succès
 *       403:
 *         description: Suppression interdite — emprunts EN_COURS
 *       404:
 *         description: Livre introuvable
 */
router.delete('/:id', validate(idParamSchema, 'params'), livreController.delete);

export default router;
