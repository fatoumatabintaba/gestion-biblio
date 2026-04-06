// src/routes/rayon.routes.js
import { Router } from 'express';
import { rayonController } from '../controllers/rayon.controller.js';
import validate from '../middlewares/validate.js';
import { createRayonSchema, updateRayonSchema } from '../validations/rayon.schema.js';
import { idParamSchema } from '../validations/common.schema.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Rayons
 *   description: Gestion des rayons thématiques de la bibliothèque
 */

/**
 * @swagger
 * /rayons:
 *   get:
 *     summary: Lister tous les rayons
 *     tags: [Rayons]
 *     responses:
 *       200:
 *         description: Liste des rayons récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.get('/', rayonController.getAll);

/**
 * @swagger
 * /rayons/{id}:
 *   get:
 *     summary: Obtenir un rayon par son ID
 *     tags: [Rayons]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du rayon
 *     responses:
 *       200:
 *         description: Rayon trouvé
 *       404:
 *         description: Rayon introuvable
 */
router.get('/:id', validate(idParamSchema, 'params'), rayonController.getById);

/**
 * @swagger
 * /rayons:
 *   post:
 *     summary: Créer un nouveau rayon
 *     tags: [Rayons]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateRayon'
 *           example:
 *             code: "RAY-SF"
 *             libelle: "Science-Fiction"
 *             localisation: "Aile B, Étage 2"
 *             sousRayon: "Franco-Belge"
 *     responses:
 *       201:
 *         description: Rayon créé avec succès
 *       400:
 *         description: Données invalides
 *       409:
 *         description: Code rayon déjà existant
 */
router.post('/', validate(createRayonSchema), rayonController.create);

/**
 * @swagger
 * /rayons/{id}:
 *   patch:
 *     summary: Mettre à jour un rayon
 *     tags: [Rayons]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateRayon'
 *     responses:
 *       200:
 *         description: Rayon mis à jour
 *       404:
 *         description: Rayon introuvable
 *       409:
 *         description: Code déjà utilisé
 */
router.patch('/:id', validate(idParamSchema, 'params'), validate(updateRayonSchema), rayonController.update);

/**
 * @swagger
 * /rayons/{id}:
 *   delete:
 *     summary: Supprimer un rayon
 *     tags: [Rayons]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Rayon supprimé avec succès
 *       403:
 *         description: Suppression interdite — le rayon contient des livres
 *       404:
 *         description: Rayon introuvable
 */
router.delete('/:id', validate(idParamSchema, 'params'), rayonController.delete);

export default router;
