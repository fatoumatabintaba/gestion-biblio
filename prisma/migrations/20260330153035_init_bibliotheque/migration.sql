-- CreateEnum
CREATE TYPE "StatutEmprunt" AS ENUM ('EN_COURS', 'RETOURNE', 'EN_RETARD');

-- CreateTable
CREATE TABLE "rayons" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "libelle" TEXT NOT NULL,
    "localisation" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rayons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "livres" (
    "id" SERIAL NOT NULL,
    "titre" TEXT NOT NULL,
    "auteur" TEXT NOT NULL,
    "isbn" TEXT NOT NULL,
    "anneePublication" INTEGER NOT NULL,
    "qteDisponible" INTEGER NOT NULL DEFAULT 0,
    "rayonId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "livres_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "adherents" (
    "id" SERIAL NOT NULL,
    "prenom" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "dateInscription" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "adherents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emprunts" (
    "id" SERIAL NOT NULL,
    "adherentId" INTEGER NOT NULL,
    "livreId" INTEGER NOT NULL,
    "dateEmprunt" TIMESTAMP(3) NOT NULL,
    "dateRetourPrevue" TIMESTAMP(3) NOT NULL,
    "statut" "StatutEmprunt" NOT NULL DEFAULT 'EN_COURS',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "emprunts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "rayons_code_key" ON "rayons"("code");

-- CreateIndex
CREATE UNIQUE INDEX "livres_isbn_key" ON "livres"("isbn");

-- CreateIndex
CREATE UNIQUE INDEX "adherents_email_key" ON "adherents"("email");

-- AddForeignKey
ALTER TABLE "livres" ADD CONSTRAINT "livres_rayonId_fkey" FOREIGN KEY ("rayonId") REFERENCES "rayons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emprunts" ADD CONSTRAINT "emprunts_adherentId_fkey" FOREIGN KEY ("adherentId") REFERENCES "adherents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emprunts" ADD CONSTRAINT "emprunts_livreId_fkey" FOREIGN KEY ("livreId") REFERENCES "livres"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
