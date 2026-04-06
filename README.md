# 📚 Bibliothèque TECH 221 — API REST

> **Groupe 6 :** Bamba · Fanta · Lamotte

API de gestion des rayons, livres, adhérents et emprunts.
Stack : **Node.js · Express · Prisma ORM · PostgreSQL · Zod · Swagger**

---

## 🏗️ Architecture

```
gestion-bibliotheque/
├─ package.json
├─ .env
├─ prisma/
│  └─ schema.prisma          # Modèles : Rayon, Livre, Adherent, Emprunt
└─ src/
   ├─ app.js                  # Express + Swagger
   ├─ server.js               # Démarrage + connexion DB
   ├─ config/
   │  ├─ env.js               # Variables d'environnement
   │  └─ db.js                # PrismaClient singleton
   ├─ routes/
   │  ├─ index.js
   │  ├─ rayon.routes.js
   │  ├─ livre.routes.js
   │  ├─ adherent.routes.js
   │  └─ emprunt.routes.js
   ├─ controllers/            # Entrée HTTP → appel service
   ├─ services/               # Logique métier & contraintes
   ├─ repositories/           # Accès Prisma (DB)
   ├─ validations/            # Schémas Zod
   ├─ middlewares/
   │  ├─ validate.js          # Middleware Zod générique
   │  ├─ errorHandler.js      # Gestion erreurs Prisma
   │  └─ notFound.js
   └─ utils/
      └─ response.js          # Helpers HTTP uniformes
```

---

## 🚀 Installation & Démarrage

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer l'environnement
cp .env.example .env
# Éditer DATABASE_URL avec vos identifiants PostgreSQL

# 3. Générer le client Prisma et migrer la base
npm run db:generate
npm run db:migrate

# 4. Démarrer en développement
npm run dev
```

Accès :
- **API** : `http://localhost:3000/api`
- **Swagger UI** : `http://localhost:3000/api-docs`
- **Health check** : `http://localhost:3000/health`

---

## 📋 Endpoints

### Rayons `/api/rayons`
| Méthode | Route          | Description                        |
|---------|----------------|------------------------------------|
| GET     | `/`            | Lister tous les rayons             |
| GET     | `/:id`         | Obtenir un rayon                   |
| POST    | `/`            | Créer un rayon                     |
| PATCH   | `/:id`         | Modifier un rayon                  |
| DELETE  | `/:id`         | Supprimer (❌ si livres présents)  |

### Livres `/api/livres`
| Méthode | Route  | Description                                   |
|---------|--------|-----------------------------------------------|
| GET     | `/`    | Lister tous les livres                        |
| GET     | `/:id` | Obtenir un livre                              |
| POST    | `/`    | Créer un livre (vérifie rayon + ISBN unique)  |
| PATCH   | `/:id` | Modifier un livre                             |
| DELETE  | `/:id` | Supprimer (❌ si emprunts EN_COURS)           |

### Adhérents `/api/adherents`
| Méthode | Route            | Description                              |
|---------|------------------|------------------------------------------|
| GET     | `/`              | Lister tous les adhérents                |
| GET     | `/:id`           | Obtenir un adhérent                      |
| GET     | `/:id/emprunts`  | Emprunts d'un adhérent                   |
| POST    | `/`              | Inscrire un adhérent (email unique)      |
| PATCH   | `/:id`           | Modifier un adhérent                     |
| DELETE  | `/:id`           | Supprimer (❌ si emprunts EN_COURS)      |

### Emprunts `/api/emprunts`
| Méthode | Route         | Description                                          |
|---------|---------------|------------------------------------------------------|
| GET     | `/`           | Lister tous les emprunts                             |
| GET     | `/:id`        | Obtenir un emprunt                                   |
| POST    | `/`           | Créer un emprunt (vérifie stock + doublon EN_COURS)  |
| PATCH   | `/:id/retour` | Retourner un livre (→ RETOURNE + stock ++)           |
| PATCH   | `/:id/retard` | Marquer EN_RETARD                                    |

---

## 🛡️ Règles métier appliquées

- **Rayon** : code unique, suppression bloquée si livres associés
- **Livre** : ISBN unique, rayonId doit exister, anneePublication ≤ année en cours, qteDisponible ≥ 0
- **Adhérent** : email unique, téléphone ≥ 6 chiffres, dateInscription ≤ aujourd'hui
- **Emprunt** :
  - Stock ≥ 1 requis avant validation
  - Doublon EN_COURS `(adherentId, livreId)` refusé
  - `dateRetourPrevue > dateEmprunt`
  - Retour : statut → RETOURNE + qteDisponible++

---

## 🌐 Format de réponse uniforme

```json
// Succès
{ "success": true, "message": "...", "data": { ... } }

// Erreur
{ "success": false, "message": "...", "details": [ { "champ": "...", "message": "..." } ] }
```

---

## 🎤 Présentation orale (2 à 3 minutes)

Bonjour Monsieur/Madame,

Je vais vous présenter mon projet intitulé **Bibliothèque TECH 221**.  
Il s'agit d'une **API REST** développée pour gérer les principales fonctionnalités d'une bibliothèque, notamment les **rayons**, les **livres**, les **adhérents** et les **emprunts**.

Sur le plan technique, le projet a été développé en **JavaScript** avec **Node.js**.  
J'ai utilisé **Express** pour créer le serveur et organiser les routes de l'API.  
Pour la base de données, j'ai choisi **PostgreSQL**, avec **Prisma ORM** comme outil d'accès et de manipulation des données.  
J'ai aussi utilisé **Zod** pour valider les données envoyées par le client, **dotenv** pour gérer les variables d'environnement, et **Swagger** pour documenter et tester les endpoints de l'API.

Le projet suit une **architecture en couches**, ce qui permet d'avoir un code bien organisé et plus facile à maintenir.  
Les **routes** définissent les endpoints, les **controllers** reçoivent les requêtes HTTP, les **services** appliquent la logique métier, les **repositories** communiquent avec la base de données, et les **validations** contrôlent les données avant leur traitement.

Par exemple, quand on crée un adhérent, les données sont d'abord validées avec Zod. Ensuite, le service vérifie si l'email est déjà utilisé. Si tout est correct, le repository enregistre l'adhérent dans la base via Prisma.

Ce projet applique aussi plusieurs **règles métier importantes**.  
Par exemple, on ne peut pas supprimer un adhérent qui a encore un emprunt en cours. On ne peut pas enregistrer deux fois le même email pour un adhérent. On ne peut pas créer un emprunt si le stock du livre est insuffisant.

Enfin, j'ai ajouté une documentation **Swagger** pour rendre l'API plus simple à comprendre et à tester.  
Donc, en résumé, ce projet m'a permis de mettre en pratique la création d'une API REST complète, la structuration d'un backend propre, la validation des données, la gestion des erreurs et la communication avec une base PostgreSQL.

Merci.

---

## 📁 Explication simple dossier par dossier

### `package.json`

Ce fichier contient les informations du projet et les dépendances principales.

On y retrouve notamment :
- `express` pour créer l'API
- `@prisma/client` et `prisma` pour la base de données
- `zod` pour la validation
- `swagger-jsdoc` et `swagger-ui-express` pour la documentation
- `dotenv` pour les variables d'environnement
- `nodemon` pour le mode développement

Scripts principaux :
- `npm start` : lance le serveur
- `npm run dev` : lance le serveur avec redémarrage automatique
- `npm run db:migrate` : applique les migrations Prisma
- `npm run db:generate` : génère le client Prisma

### `.env`

Ce fichier contient les variables d'environnement du projet, par exemple :
- le port du serveur
- l'environnement d'exécution
- l'URL de connexion à la base PostgreSQL

Cela évite de mettre des informations sensibles directement dans le code.

### `prisma/`

Ce dossier contient la configuration de la base de données.

#### `schema.prisma`

C'est le fichier principal de Prisma.  
Il définit :
- la connexion à PostgreSQL
- les modèles de données : `Rayon`, `Livre`, `Adherent`, `Emprunt`
- les relations entre les tables
- l'énumération `StatutEmprunt`

#### `migrations/`

Ce dossier contient les migrations SQL générées par Prisma pour créer les tables dans la base de données.

### `src/server.js`

C'est le point d'entrée du projet.

Son rôle :
- charger l'application Express
- lire la configuration
- se connecter à la base
- démarrer le serveur
- fermer proprement la connexion Prisma à l'arrêt

### `src/app.js`

Ce fichier configure l'application Express.

Il contient :
- les middlewares JSON
- la configuration Swagger
- les routes principales de l'API
- la route `/health`
- la gestion du `404`
- le middleware global de gestion des erreurs

### `src/config/`

#### `env.js`

Ce fichier centralise la lecture des variables d'environnement avec `dotenv`.

#### `db.js`

Ce fichier crée une instance unique de `PrismaClient` pour accéder à la base de données.

### `src/routes/`

Ce dossier définit les endpoints de l'API.

Exemples :
- `/api/rayons`
- `/api/livres`
- `/api/adherents`
- `/api/emprunts`

Le fichier `index.js` regroupe toutes les routes.

### `src/controllers/`

Les controllers reçoivent les requêtes HTTP et appellent les services.

Ils ne contiennent pas toute la logique métier.  
Leur rôle est surtout de :
- récupérer les paramètres
- appeler le bon service
- renvoyer la réponse au client

Exemple : `adherent.controller.js`

### `src/services/`

Les services contiennent la logique métier.

C'est ici qu'on applique les règles importantes du projet.

Exemples :
- vérifier si un email existe déjà
- empêcher la suppression d'un adhérent avec un emprunt en cours
- vérifier le stock avant un emprunt
- transformer certaines données avant enregistrement

### `src/repositories/`

Les repositories communiquent directement avec la base de données via Prisma.

Ils contiennent les opérations comme :
- `findAll`
- `findById`
- `create`
- `update`
- `delete`

Cette séparation permet de ne pas mélanger accès base et logique métier.

### `src/validations/`

Ce dossier contient les schémas **Zod** utilisés pour valider les données envoyées par le client.

Exemple pour un adhérent :
- prénom obligatoire
- nom obligatoire
- email valide
- téléphone valide
- date d'inscription non future

### `src/middlewares/`

Ce dossier contient les traitements intermédiaires.

#### `validate.js`

Middleware générique qui applique les schémas Zod.

#### `errorHandler.js`

Middleware global qui intercepte les erreurs et renvoie une réponse propre.

#### `notFound.js`

Middleware utilisé lorsque la route demandée n'existe pas.

### `src/utils/`

Ce dossier contient les fonctions utilitaires.

#### `response.js`

Permet de standardiser les réponses JSON de l'API, pour avoir toujours un format cohérent en cas de succès ou d'erreur.

---

## ❓ Questions probables du prof avec réponses

### 1. Quel est le but de votre projet ?

Le but de mon projet est de développer une API REST capable de gérer les opérations principales d'une bibliothèque : les rayons, les livres, les adhérents et les emprunts.

### 2. Pourquoi avez-vous utilisé Node.js et Express ?

J'ai utilisé Node.js parce qu'il permet de développer des applications backend en JavaScript.  
J'ai choisi Express parce qu'il est simple, léger et très adapté pour construire des API REST rapidement.

### 3. Pourquoi avez-vous choisi PostgreSQL ?

J'ai choisi PostgreSQL parce que c'est un système de gestion de base de données relationnelle robuste, fiable et bien adapté aux projets structurés avec plusieurs relations entre tables.

### 4. Quel est le rôle de Prisma dans votre projet ?

Prisma est un ORM.  
Il me permet de manipuler la base de données en JavaScript sans écrire directement toutes les requêtes SQL, tout en gardant un schéma clair et des migrations propres.

### 5. Pourquoi avez-vous utilisé Zod ?

J'ai utilisé Zod pour valider les données entrantes avant de les traiter.  
Cela permet d'éviter les erreurs, de sécuriser l'API et de garantir que les données respectent le format attendu.

### 6. Quelle est l'utilité de Swagger ?

Swagger sert à documenter l'API et à tester les endpoints directement depuis une interface web.  
C'est très utile pour comprendre rapidement le fonctionnement du projet.

### 7. Pourquoi avez-vous séparé le projet en routes, controllers, services et repositories ?

J'ai séparé le projet pour respecter une architecture claire.  
Chaque couche a une responsabilité précise :
- les routes définissent les endpoints
- les controllers gèrent les requêtes et réponses
- les services appliquent la logique métier
- les repositories accèdent à la base

Cette organisation rend le projet plus lisible, plus maintenable et plus évolutif.

### 8. Donnez un exemple de règle métier dans votre projet.

Par exemple, un adhérent ne peut pas être supprimé s'il a encore un emprunt en cours.  
Autre exemple : un emprunt ne peut pas être créé si le livre n'est plus disponible en stock.

### 9. Comment gérez-vous les erreurs ?

Les erreurs sont centralisées dans un middleware global.  
Cela permet de renvoyer des réponses cohérentes au client, y compris pour les erreurs Prisma ou les erreurs métier.

### 10. Comment démarre l'application ?

L'application démarre depuis `src/server.js`.  
Ce fichier établit la connexion à la base de données puis lance le serveur Express sur le port configuré.

### 11. Est-ce qu'il y a un frontend dans ce projet ?

Dans ce dépôt, non.  
Le projet contient surtout la partie backend, c'est-à-dire l'API.  
Cette API peut ensuite être utilisée par un frontend web, mobile ou par Swagger/Postman.

### 12. Quel est le parcours d'une requête dans votre application ?

Une requête passe généralement par :
1. la route
2. le controller
3. le service
4. le repository
5. la base de données

Puis la réponse remonte vers le client avec un format JSON standardisé.

---

## 📝 Résumé très court à retenir

Si tu dois répondre rapidement devant le prof, tu peux dire :

> Mon projet est une API REST de gestion de bibliothèque développée en JavaScript avec Node.js et Express.  
> J'utilise PostgreSQL comme base de données, Prisma comme ORM, Zod pour la validation et Swagger pour la documentation.  
> Le projet est organisé en couches : routes, controllers, services, repositories, validations et middlewares.  
> Il permet de gérer les rayons, les livres, les adhérents et les emprunts, tout en appliquant des règles métier comme l'unicité des emails ou la vérification du stock.
