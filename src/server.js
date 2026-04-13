// src/server.js
import 'dotenv/config';
import app from './app.js';
import { config } from './config/env.js';
import prisma from './config/db.js';

const PORT = config.port;
const HOST = config.host || 'localhost'; // ✅ FIX IMPORTANT

const start = async () => {
  try {
    // Vérification connexion DB
    await prisma.$connect();
    console.log('✅  Connexion à la base de données établie');

    app.listen(PORT, HOST, () => {
      const displayHost = HOST === '0.0.0.0' ? 'localhost' : HOST;

      console.log(`🚀  Serveur démarré sur http://${displayHost}:${PORT}`);
      console.log(`📚  Bibliothèque TECH 221 — Groupe 6 : Bamba · Fanta · Lamotte`);
      console.log(`📖  Documentation Swagger : http://${displayHost}:${PORT}/api-docs`);
      console.log(`🔗  API Base URL          : http://${displayHost}:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌  Erreur au démarrage :', error);
    await prisma.$disconnect();
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑  Arrêt du serveur...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

start();
