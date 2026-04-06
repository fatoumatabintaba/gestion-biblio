# Livrable 2 - Notes d'implémentation

Ce document explique comment le livrable 2 a été intégré dans le projet `gestion-bibliotheque`.

## 1. Nouvelles dépendances

Les dépendances suivantes ont été ajoutées dans `package.json` :

- `multer` pour gérer l'upload `multipart/form-data`
- `cloudinary` pour l'envoi et la suppression d'images

## 2. Modifications Prisma

### Adherent

Champs ajoutés :

- `matricule` : `String @unique`
- `photo` : URL publique Cloudinary
- `photoPublicId` : identifiant Cloudinary interne pour la suppression

Le matricule est généré côté serveur au format :

```txt
ADH-AAAA-XXXX
```

Exemple :

```txt
ADH-2026-0001
```

### Livre

Champs ajoutés :

- `couverture` : URL publique Cloudinary
- `couverturePublicId` : identifiant Cloudinary interne

### Rayon

Champ ajouté :

- `sousRayon`

Le rayon est maintenant unique par couple :

```txt
(code, sousRayon)
```

Quand `sousRayon` n'est pas fourni, il est normalisé en chaîne vide côté base, ce qui permet de conserver un rayon "non divisé" tout en gardant une vraie contrainte d'unicité.

## 3. Upload image

Le middleware d'upload se trouve dans :

- `src/middlewares/upload.js`

Règles appliquées :

- types autorisés : `image/jpeg`, `image/png`
- taille maximale : `2 Mo`
- stockage temporaire en mémoire via `multer.memoryStorage()`

L'envoi Cloudinary se fait ensuite dans :

- `src/services/cloudinary.service.js`

Les images sont envoyées dans les dossiers :

- `bibliotheque/adherents`
- `bibliotheque/livres`

## 4. Génération du matricule

La génération se fait dans :

- `src/utils/matricule.js`
- `src/services/adherent.service.js`

Principe :

1. On récupère le dernier matricule de l'année courante en base.
2. On incrémente la séquence.
3. Le champ `matricule` n'est jamais accepté depuis la requête client.

Exemple :

- dernier matricule : `ADH-2026-0007`
- nouveau matricule : `ADH-2026-0008`

En cas de collision rare en concurrence, le service retente automatiquement la génération.

## 5. Suppression des images Cloudinary

### Adhérent

- à la suppression d'un adhérent, la photo Cloudinary est supprimée
- lors d'un remplacement de photo, l'ancienne image est supprimée après mise à jour réussie

### Livre

- à la suppression d'un livre, la couverture Cloudinary est supprimée
- lors d'un remplacement de couverture, l'ancienne image est supprimée après mise à jour réussie

Le `public_id` est conservé en base uniquement pour permettre ces suppressions proprement.

## 6. Routes impactées

### Adhérents

- `POST /api/adherents`
- `PATCH /api/adherents/:id`

Champ fichier attendu :

- `photo`

### Livres

- `POST /api/livres`
- `PATCH /api/livres/:id`

Champ fichier attendu :

- `couverture`

Les routes restent compatibles avec Swagger via `/api-docs`.

## 7. Variables d'environnement

Voir le fichier `.env.example`.

Variables nécessaires :

```env
DATABASE_URL=
HOST=
PORT=
NODE_ENV=
PUBLIC_BASE_URL=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

`PUBLIC_BASE_URL` permet d'afficher un serveur Swagger cohérent en local ou en production.

## 8. Migration de base de données

Une migration Prisma a été ajoutée :

- `prisma/migrations/20260406140000_livrable_2_enrichissements/migration.sql`

Après configuration du `.env`, exécuter :

```bash
npm run db:generate
npx prisma migrate deploy
```

En développement, tu peux aussi utiliser :

```bash
npm run db:migrate
```

## 9. Déploiement Render

Étapes recommandées :

1. Pousser le dépôt sur GitHub
2. Créer un nouveau `Web Service` sur Render
3. Connecter le dépôt GitHub
4. Configurer :

Build command :

```bash
npm install && npm run build
```

Start command :

```bash
npm start
```

5. Ajouter les variables d'environnement :

- `DATABASE_URL`
- `HOST=0.0.0.0`
- `PORT`
- `NODE_ENV=production`
- `PUBLIC_BASE_URL=https://ton-app.onrender.com`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

6. Appliquer les migrations :

```bash
npm run db:deploy
```

Swagger restera accessible ici :

```txt
https://ton-app.onrender.com/api-docs
```

Tu peux aussi utiliser le fichier `render.yaml` ajouté à la racine du dépôt pour créer un Blueprint Render plus rapidement.

## 10. Remarques importantes

- Le projet accepte maintenant les formulaires `multipart/form-data` pour les créations et mises à jour avec image.
- Les identifiants Cloudinary internes ne sont pas exposés dans les réponses publiques.
- Si aucune image n'est envoyée, la création d'un adhérent ou d'un livre reste possible.
