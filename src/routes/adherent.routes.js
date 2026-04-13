// src/routes/adherent.routes.js
import { Router } from 'express';
import { adherentController } from '../controllers/adherent.controller.js';
import validate from '../middlewares/validate.js';
import { createAdherentSchema, updateAdherentSchema } from '../validations/adherent.schema.js';
import { idParamSchema } from '../validations/common.schema.js';
import { makeUpload } from '../config/cloudinary.js';

const router = Router();
const upload = makeUpload('adherents');

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
 *     summary: Lister les emprunts d'un adhérent
 *     tags: [Adhérents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Emprunts récupérés
 *       404:
 *         description: Adhérent introuvable
 */
router.get('/:id/emprunts', validate(idParamSchema, 'params'), adherentController.getEmprunts);

/**
 * @swagger
 * /adherents:
 *   post:
 *     summary: Inscrire un nouvel adhérent (photo optionnelle)
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
 *                 description: JPEG ou PNG, max 2 Mo
 *     responses:
 *       201:
 *         description: Adhérent inscrit — matricule auto-généré
 *       400:
 *         description: Données invalides
 *       409:
 *         description: Email déjà utilisé
 */
router.post('/', upload.single('photo'), validate(createAdherentSchema), adherentController.create);

/**
 * @swagger
 * /adherents/{id}:
 *   patch:
 *     summary: Mettre à jour un adhérent (champs texte)
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
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateAdherent'
 *     responses:
 *       200:
 *         description: Adhérent mis à jour
 *       404:
 *         description: Adhérent introuvable
 *       409:
 *         description: Email déjà utilisé
 */
router.patch('/:id', validate(idParamSchema, 'params'), validate(updateAdherentSchema), adherentController.update);

/**
 * @swagger
 * /adherents/{id}/photo:
 *   patch:
 *     summary: Mettre à jour la photo d'un adhérent
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
 *             required: [photo]
 *             properties:
 *               photo:
 *                 type: string
 *                 format: binary
 *                 description: JPEG ou PNG, max 2 Mo
 *     responses:
 *       200:
 *         description: Photo mise à jour
 *       400:
 *         description: Fichier manquant ou invalide
 *       404:
 *         description: Adhérent introuvable
 */
router.patch('/:id/photo', validate(idParamSchema, 'params'), upload.single('photo'), adherentController.updatePhoto);

/**
 * @swagger
 * /adherents/{id}:
 *   delete:
 *     summary: Supprimer un adhérent (photo Cloudinary supprimée aussi)
 *     tags: [Adhérents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Adhérent supprimé
 *       403:
 *         description: Emprunts EN_COURS — suppression interdite
 *       404:
 *         description: Adhérent introuvable
 */
router.delete('/:id', validate(idParamSchema, 'params'), adherentController.delete);

export default router;