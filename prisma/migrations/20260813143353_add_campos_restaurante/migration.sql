-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Restaurante" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "endereco" TEXT NOT NULL,
    "telefone" TEXT,
    "categoria" TEXT NOT NULL DEFAULT 'Geral',
    "emoji" TEXT NOT NULL DEFAULT '🍽️',
    "tempo" TEXT NOT NULL DEFAULT '30-40 min',
    "nota" REAL NOT NULL DEFAULT 4.5,
    "taxa" REAL NOT NULL DEFAULT 0,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Restaurante" ("criadoEm", "descricao", "endereco", "id", "nome", "telefone") SELECT "criadoEm", "descricao", "endereco", "id", "nome", "telefone" FROM "Restaurante";
DROP TABLE "Restaurante";
ALTER TABLE "new_Restaurante" RENAME TO "Restaurante";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
