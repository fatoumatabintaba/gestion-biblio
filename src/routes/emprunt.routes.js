// src/routes/emprunt.routes.js
import { Router } from 'express';
import { empruntController } from '../controllers/emprunt.controller.js';
import validate from '../middlewares/validate.js';
import { createEmpruntSchema } from '../validations/emprunt.schema.js';
import { idParamSchema } from '../validations/common.schema.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Emprunts
 *   description: Gestion des emprunts de livres
 */

/**
 * @swagger
 * /emprunts:
 *   get:
 *     summary: Lister tous les emprunts
 *     tags: [Emprunts]
 *     responses:
 *       200:
 *         description: Liste des emprunts récupérée avec succès
 */
router.get('/', empruntController.getAll);

/**
 * @swagger
 * /emprunts/{id}:
 *   get:
 *     summary: Obtenir un emprunt par son ID
 *     tags: [Emprunts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Emprunt trouvé
 *       404:
 *         description: Emprunt introuvable
 */
router.get('/:id', validate(idParamSchema, 'params'), empruntController.getById);

/**
 * @swagger
 * /emprunts:
 *   post:
 *     summary: Enregistrer un nouvel emprunt
 *     tags: [Emprunts]
 *     description: |
 *       Règles métier appliquées :
 *       - L'adhérent et le livre doivent exister.
 *       - Le stock (qteDisponible) doit être >= 1.
 *       - Aucun emprunt EN_COURS ne doit exister pour le même couple (adherentId, livreId).
 *       - dateRetourPrevue doit être > dateEmprunt.
 *       - Si validé : qteDisponible est décrémenté automatiquement.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateEmprunt'
 *           example:
 *             adherentId: 1
 *             livreId: 2
 *             dateEmprunt: "2024-03-01"
 *             dateRetourPrevue: "2024-03-15"
 *     responses:
 *       201:
 *         description: Emprunt enregistré avec succès
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Adhérent ou livre introuvable
 *       409:
 *         description: Stock insuffisant ou doublon EN_COURS
 */
router.post('/', validate(createEmpruntSchema), empruntController.create);

/**
 * @swagger
 * /emprunts/{id}/retour:
 *   patch:
 *     summary: Enregistrer le retour d'un livre emprunté
 *     tags: [Emprunts]
 *     description: |
 *       Passe le statut à RETOURNE et réincrémente le stock (qteDisponible) du livre.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Retour enregistré avec succès
 *       404:
 *         description: Emprunt introuvable
 *       409:
 *         description: L'emprunt est déjà retourné
 */
router.patch('/:id/retour', validate(idParamSchema, 'params'), empruntController.retourner);

/**
 * @swagger
 * /emprunts/{id}/retard:
 *   patch:
 *     summary: Marquer un emprunt EN_RETARD
 *     tags: [Emprunts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Emprunt marqué EN_RETARD
 *       404:
 *         description: Emprunt introuvable
 *       409:
 *         description: Statut incompatible (déjà retourné ou en retard)
 */
router.patch('/:id/retard', validate(idParamSchema, 'params'), empruntController.marquerEnRetard);

export default router;
