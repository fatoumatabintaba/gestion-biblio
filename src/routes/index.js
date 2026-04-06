// src/routes/index.js
import { Router } from 'express';
import rayonRoutes from './rayon.routes.js';
import livreRoutes from './livre.routes.js';
import adherentRoutes from './adherent.routes.js';
import empruntRoutes from './emprunt.routes.js';

const router = Router();

router.use('/rayons', rayonRoutes);
router.use('/livres', livreRoutes);
router.use('/adherents', adherentRoutes);
router.use('/emprunts', empruntRoutes);

export default router;
