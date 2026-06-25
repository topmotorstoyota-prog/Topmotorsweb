/*
  Warnings:

  - You are about to drop the column `answer` on the `ToyotaQ` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `ToyotaQ` table. All the data in the column will be lost.
  - You are about to drop the column `question` on the `ToyotaQ` table. All the data in the column will be lost.
  - Added the required column `name` to the `ToyotaQ` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ToyotaQ` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Vehicle" ADD COLUMN "images" TEXT;

-- CreateTable
CREATE TABLE "Booking" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "vehicle" TEXT,
    "plate" TEXT,
    "date" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Шинэ',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ToyotaQ" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "price" TEXT,
    "image" TEXT,
    "images" TEXT,
    "year" TEXT,
    "mileage" TEXT,
    "engine" TEXT,
    "engineType" TEXT,
    "description" TEXT,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_ToyotaQ" ("id") SELECT "id" FROM "ToyotaQ";
DROP TABLE "ToyotaQ";
ALTER TABLE "new_ToyotaQ" RENAME TO "ToyotaQ";
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "role" TEXT NOT NULL DEFAULT 'EDITOR',
    "canManageVehicles" BOOLEAN NOT NULL DEFAULT false,
    "canManageNews" BOOLEAN NOT NULL DEFAULT false,
    "canManageParts" BOOLEAN NOT NULL DEFAULT false,
    "canManageProducts" BOOLEAN NOT NULL DEFAULT false,
    "canManageToyotaQ" BOOLEAN NOT NULL DEFAULT false,
    "canManageBookings" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_User" ("createdAt", "email", "id", "name", "password", "role") SELECT "createdAt", "email", "id", "name", "password", "role" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
