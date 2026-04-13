// src/app.js
import express from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';


import { config } from './config/env.js';
import router from './routes/index.js';
import errorHandler from './middlewares/errorHandler.js';
import notFoundMiddleware from './middlewares/notFound.js';

const app = express();

// ─── Parsers ────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Swagger ─────────────────────────────────────────────────
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Bibliothèque TECH 221 — API REST',
      version: '1.0.0',
      description:
        'API de gestion des rayons, livres, adhérents et emprunts.\n\n**Groupe 6 :** Bamba · Fanta · Lamotte',
      contact: {
        name: 'Groupe 6 — TECH 221',
      },
    },
    servers: [
      {
        url: `${config.publicBaseUrl || 'http://localhost:3000'}/api`,

        description: config.nodeEnv === 'production' ? 'Serveur de production' : 'Serveur de développement',
      },
    ],
    components: {
      schemas: {
        // ── Rayon ──────────────────────────────────────────────
        CreateRayon: {
          type: 'object',
          required: ['code', 'libelle', 'localisation'],
          properties: {
            code: { type: 'string', example: 'RAY-SF', description: 'Code unique en majuscules' },
            libelle: { type: 'string', example: 'Science-Fiction' },
            localisation: { type: 'string', example: 'Aile B, Étage 2' },
            sousRayon: { type: 'string', example: 'Franco-Belge', nullable: true },
          },
        },
        UpdateRayon: {
          type: 'object',
          properties: {
            code: { type: 'string', example: 'RAY-SF' },
            libelle: { type: 'string', example: 'Science-Fiction' },
            localisation: { type: 'string', example: 'Aile B, Étage 2' },
            sousRayon: { type: 'string', example: 'Manga', nullable: true },
          },
        },
        // ── Livre ──────────────────────────────────────────────
        CreateLivre: {
          type: 'object',
          required: ['titre', 'auteur', 'isbn', 'anneePublication', 'qteDisponible', 'rayonId'],
          properties: {
            titre: { type: 'string', example: 'Dune' },
            auteur: { type: 'string', example: 'Frank Herbert' },
            isbn: { type: 'string', example: '978-2-07-036822-8' },
            anneePublication: { type: 'integer', example: 1965 },
            qteDisponible: { type: 'integer', minimum: 0, example: 3 },
            rayonId: { type: 'integer', example: 1 },
            couverture: {
              type: 'string',
              format: 'uri',
              example: 'https://res.cloudinary.com/demo/image/upload/v1/livres/dune.jpg',
              readOnly: true,
            },
          },
        },
        UpdateLivre: {
          type: 'object',
          properties: {
            titre: { type: 'string' },
            auteur: { type: 'string' },
            isbn: { type: 'string' },
            anneePublication: { type: 'integer' },
            qteDisponible: { type: 'integer', minimum: 0 },
            rayonId: { type: 'integer' },
            couverture: { type: 'string', format: 'uri', readOnly: true },
          },
        },
        // ── Adhérent ───────────────────────────────────────────
        CreateAdherent: {
          type: 'object',
          required: ['prenom', 'nom', 'email', 'telephone', 'dateInscription'],
          properties: {
            matricule: { type: 'string', example: 'ADH-2026-0001', readOnly: true },
            prenom: { type: 'string', example: 'Aminata' },
            nom: { type: 'string', example: 'Diallo' },
            email: { type: 'string', format: 'email', example: 'aminata.diallo@example.com' },
            telephone: { type: 'string', example: '+221 77 000 00 00' },
            dateInscription: { type: 'string', format: 'date', example: '2024-01-15' },
            photo: {
              type: 'string',
              format: 'uri',
              example: 'https://res.cloudinary.com/demo/image/upload/v1/adherents/aminata.jpg',
              readOnly: true,
            },
          },
        },
        UpdateAdherent: {
          type: 'object',
          properties: {
            prenom: { type: 'string' },
            nom: { type: 'string' },
            email: { type: 'string', format: 'email' },
            telephone: { type: 'string' },
            dateInscription: { type: 'string', format: 'date' },
            photo: { type: 'string', format: 'uri', readOnly: true },
          },
        },
        // ── Emprunt ────────────────────────────────────────────
        CreateEmprunt: {
          type: 'object',
          required: ['adherentId', 'livreId', 'dateEmprunt', 'dateRetourPrevue'],
          properties: {
            adherentId: { type: 'integer', example: 1 },
            livreId: { type: 'integer', example: 2 },
            dateEmprunt: { type: 'string', format: 'date', example: '2024-03-01' },
            dateRetourPrevue: { type: 'string', format: 'date', example: '2024-03-15' },
          },
        },
        // ── Réponses génériques ────────────────────────────────
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Opération réussie' },
            data: { type: 'object' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Message d\'erreur' },
            details: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  champ: { type: 'string' },
                  message: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'Bibliothèque TECH 221 — API Docs',
  swaggerOptions: { docExpansion: 'list', filter: true },
}));

// ─── Routes API ──────────────────────────────────────────────
app.use('/api', router);

// ─── Health check ────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'Bibliothèque TECH 221', timestamp: new Date().toISOString() });
});

// ─── 404 & Error Handler ─────────────────────────────────────
app.use(notFoundMiddleware);
app.use(errorHandler);

export default app;
