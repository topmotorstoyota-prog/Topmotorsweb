/*
  Warnings:

  - You are about to drop the `Part` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `canManageParts` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Booking" ADD COLUMN "serviceType" TEXT;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN "images" TEXT;
ALTER TABLE "Product" ADD COLUMN "size" TEXT;

-- AlterTable
ALTER TABLE "ToyotaQ" ADD COLUMN "serviceHistory" TEXT;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Part";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Staff" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "image" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "role" TEXT NOT NULL DEFAULT 'EDITOR',
    "canManageVehicles" BOOLEAN NOT NULL DEFAULT false,
    "canManageNews" BOOLEAN NOT NULL DEFAULT false,
    "canManageProducts" BOOLEAN NOT NULL DEFAULT false,
    "canManageToyotaQ" BOOLEAN NOT NULL DEFAULT false,
    "canManageBookings" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_User" ("canManageBookings", "canManageNews", "canManageProducts", "canManageToyotaQ", "canManageVehicles", "createdAt", "email", "id", "name", "password", "role") SELECT "canManageBookings", "canManageNews", "canManageProducts", "canManageToyotaQ", "canManageVehicles", "createdAt", "email", "id", "name", "password", "role" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE TABLE "new_Vehicle" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT NOT NULL,
    "images" TEXT,
    "images360" TEXT,
    "description" TEXT NOT NULL,
    "price" TEXT,
    "colors" TEXT,
    "variants" TEXT,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Vehicle" ("category", "colors", "description", "id", "image", "images", "name", "price", "updatedAt", "variants") SELECT "category", "colors", "description", "id", "image", "images", "name", "price", "updatedAt", "variants" FROM "Vehicle";
DROP TABLE "Vehicle";
ALTER TABLE "new_Vehicle" RENAME TO "Vehicle";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
