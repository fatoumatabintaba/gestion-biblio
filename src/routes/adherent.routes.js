// src/routes/adherent.routes.js
import { Router } from 'express';
import { adherentController } from '../controllers/adherent.controller.js';
import validate from '../middlewares/validate.js';
import { uploadSingleImage } from '../middlewares/upload.js';
import { createAdherentSchema, updateAdherentSchema } from '../validations/adherent.schema.js';
import { idParamSchema } from '../validations/common.schema.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Adhérents
 *   description: Gestion des adhérents de la bibliothèque
 */

/**
 * @swagger
 * /adherents:
 *   get:
 *     summary: Lister tous les adhérents
 *     tags: [Adhérents]
 *     responses:
 *       200:
 *         description: Liste des adhérents récupérée avec succès
 */
router.get('/', adherentController.getAll);

/**
 * @swagger
 * /adherents/{id}:
 *   get:
 *     summary: Obtenir un adhérent par son ID
 *     tags: [Adhérents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Adhérent trouvé
 *       404:
 *         description: Adhérent introuvable
 */
router.get('/:id', validate(idParamSchema, 'params'), adherentController.getById);

/**
 * @swagger
 * /adherents/{id}/emprunts:
 *   get:
 *     summary: Lister tous les emprunts d'un adhérent
 *     tags: [Adhérents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Emprunts de l'adhérent récupérés
 *       404:
 *         description: Adhérent introuvable
 */
router.get('/:id/emprunts', validate(idParamSchema, 'params'), adherentController.getEmprunts);

/**
 * @swagger
 * /adherents:
 *   post:
 *     summary: Inscrire un nouvel adhérent
 *     tags: [Adhérents]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [prenom, nom, email, telephone, dateInscription]
 *             properties:
 *               prenom:
 *                 type: string
 *                 example: Aminata
 *               nom:
 *                 type: string
 *                 example: Diallo
 *               email:
 *                 type: string
 *                 format: email
 *                 example: aminata.diallo@example.com
 *               telephone:
 *                 type: string
 *                 example: +221 77 000 00 00
 *               dateInscription:
 *                 type: string
 *                 format: date
 *                 example: 2024-01-15
 *               photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Adhérent inscrit avec succès
 *       400:
 *         description: Données invalides
 *       409:
 *         description: Email déjà utilisé
 */
router.post('/', uploadSingleImage('photo'), validate(createAdherentSchema), adherentController.create);

/**
 * @swagger
 * /adherents/{id}:
 *   patch:
 *     summary: Mettre à jour un adhérent
 *     tags: [Adhérents]
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
 *               prenom:
 *                 type: string
 *               nom:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               telephone:
 *                 type: string
 *               dateInscription:
 *                 type: string
 *                 format: date
 *               photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Adhérent mis à jour
 *       404:
 *         description: Adhérent introuvable
 *       409:
 *         description: Email déjà utilisé
 */
router.patch(
  '/:id',
  validate(idParamSchema, 'params'),
  uploadSingleImage('photo'),
  validate(updateAdherentSchema),
  adherentController.update
);

/**
 * @swagger
 * /adherents/{id}:
 *   delete:
 *     summary: Supprimer un adhérent
 *     tags: [Adhérents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Adhérent supprimé avec succès
 *       403:
 *         description: Suppression interdite — emprunts EN_COURS
 *       404:
 *         description: Adhérent introuvable
 */
router.delete('/:id', validate(idParamSchema, 'params'), adherentController.delete);

export default router;
