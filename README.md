# ObjectVault — Backend

API REST temps réel pour la gestion d'objets avec upload d'images.

## Stack

- **NestJS** + TypeScript
- **MongoDB Atlas** (base de données)
- **Cloudflare R2** (stockage images S3-compatible)
- **Socket.IO** (temps réel)
- **Multer** (upload multipart)

## Prérequis

- Node.js >= 18
- Compte MongoDB Atlas
- Compte Cloudflare R2 avec bucket configuré

## Installation locale

```bash
git clone <repo-backend>
cd backend
npm install
cp .env.example .env
# Remplir les variables dans .env
npm run start:dev
```

## Variables d'environnement

| Variable        | Description                                     |
| --------------- | ----------------------------------------------- |
| `PORT`          | Port du serveur (défaut: 3001)                  |
| `MONGODB_URI`   | URI MongoDB Atlas                               |
| `S3_ENDPOINT`   | `https://<account_id>.r2.cloudflarestorage.com` |
| `S3_REGION`     | `auto`                                          |
| `S3_BUCKET`     | Nom du bucket R2                                |
| `S3_ACCESS_KEY` | Access Key ID du token R2                       |
| `S3_SECRET_KEY` | Secret Access Key du token R2                   |
| `S3_PUBLIC_URL` | `https://pub-<hash>.r2.dev`                     |
| `FRONTEND_URL`  | URL du frontend (CORS)                          |

## Routes API

| Méthode  | Route          | Description                   |
| -------- | -------------- | ----------------------------- |
| `POST`   | `/objects`     | Créer un objet + upload image |
| `GET`    | `/objects`     | Liste tous les objets         |
| `GET`    | `/objects/:id` | Détail d'un objet             |
| `DELETE` | `/objects/:id` | Supprimer objet + image S3    |

### POST /objects

- **Content-Type** : `multipart/form-data`
- **Champs** : `title` (string), `description` (string), `image` (file)
- **Réponse** : `201` avec l'objet créé

## Temps réel — Socket.IO

Événement émis après chaque création :
event : object.created
payload : { \_id, title, description, imageUrl, createdAt }

## Architecture

src/
objects/
dto/create-object.dto.ts
schemas/object.schema.ts
objects.controller.ts
objects.service.ts
objects.gateway.ts
objects.module.ts
s3/
s3.service.ts
app.module.ts
main.ts

## Choix techniques

- **memoryStorage Multer** — image streamée directement vers R2 sans écriture disque
- **imageKey en base** — clé S3 stockée pour la suppression propre sur R2
- **Événement Socket.IO post-save** — émis uniquement après confirmation MongoDB
- **class-validator** — validation des DTOs via pipe global

## Déploiement

Déployé sur **Railway**. Variables d'environnement à configurer dans le dashboard Railway.
