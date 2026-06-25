/*
  Warnings:

  - You are about to drop the column `partNumber` on the `Product` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Part" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "price" TEXT,
    "image" TEXT,
    "description" TEXT,
    "partNumber" TEXT,
    "stock" TEXT DEFAULT 'Бэлэн байгаа'
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "price" TEXT,
    "image" TEXT,
    "description" TEXT,
    "stock" TEXT DEFAULT 'Бэлэн байгаа'
);
INSERT INTO "new_Product" ("category", "description", "id", "image", "name", "price", "stock") SELECT "category", "description", "id", "image", "name", "price", "stock" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
