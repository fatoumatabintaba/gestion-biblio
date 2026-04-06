-- AlterTable
ALTER TABLE "rayons"
ADD COLUMN "sousRayon" TEXT NOT NULL DEFAULT '';

-- Replace unique constraint on code by a composite unique index
DROP INDEX IF EXISTS "rayons_code_key";
CREATE UNIQUE INDEX "rayons_code_sousRayon_key" ON "rayons"("code", "sousRayon");

-- AlterTable
ALTER TABLE "livres"
ADD COLUMN "couverture" TEXT,
ADD COLUMN "couverturePublicId" TEXT;

-- AlterTable
ALTER TABLE "adherents"
ADD COLUMN "matricule" TEXT,
ADD COLUMN "photo" TEXT,
ADD COLUMN "photoPublicId" TEXT;

-- Populate matricule for existing rows before making it required
WITH ordered_adherents AS (
  SELECT
    id,
    "dateInscription",
    ROW_NUMBER() OVER (PARTITION BY EXTRACT(YEAR FROM "dateInscription") ORDER BY id) AS sequence_number
  FROM "adherents"
)
UPDATE "adherents" AS a
SET "matricule" = 'ADH-'
  || EXTRACT(YEAR FROM oa."dateInscription")::TEXT
  || '-'
  || LPAD(oa.sequence_number::TEXT, 4, '0')
FROM ordered_adherents AS oa
WHERE a.id = oa.id;

ALTER TABLE "adherents"
ALTER COLUMN "matricule" SET NOT NULL;

CREATE UNIQUE INDEX "adherents_matricule_key" ON "adherents"("matricule");
