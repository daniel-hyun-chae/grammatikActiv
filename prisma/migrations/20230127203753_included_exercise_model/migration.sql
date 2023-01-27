-- CreateEnum
CREATE TYPE "ExerciseType" AS ENUM ('FillInTheBlankItem');

-- CreateTable
CREATE TABLE "Exercise" (
    "id" TEXT NOT NULL,
    "instruction" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "type" "ExerciseType" NOT NULL,

    CONSTRAINT "Exercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FillInTheBlankItem" (
    "id" TEXT NOT NULL,
    "sentence" TEXT NOT NULL,
    "exerciseId" TEXT,
    "connectSentenceLeftId" TEXT,
    "connectSentenceRightId" TEXT,

    CONSTRAINT "FillInTheBlankItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConnectSentenceItem" (
    "id" TEXT NOT NULL,
    "leftString" TEXT,
    "rightString" TEXT,
    "exerciseId" TEXT NOT NULL,

    CONSTRAINT "ConnectSentenceItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Blank" (
    "id" TEXT NOT NULL,
    "start" INTEGER NOT NULL,
    "end" INTEGER NOT NULL,
    "fillInTheBlankItemId" TEXT NOT NULL,

    CONSTRAINT "Blank_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FillInTheBlankItem_connectSentenceLeftId_key" ON "FillInTheBlankItem"("connectSentenceLeftId");

-- CreateIndex
CREATE UNIQUE INDEX "FillInTheBlankItem_connectSentenceRightId_key" ON "FillInTheBlankItem"("connectSentenceRightId");

-- AddForeignKey
ALTER TABLE "Exercise" ADD CONSTRAINT "Exercise_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FillInTheBlankItem" ADD CONSTRAINT "FillInTheBlankItem_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FillInTheBlankItem" ADD CONSTRAINT "FillInTheBlankItem_connectSentenceLeftId_fkey" FOREIGN KEY ("connectSentenceLeftId") REFERENCES "ConnectSentenceItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FillInTheBlankItem" ADD CONSTRAINT "FillInTheBlankItem_connectSentenceRightId_fkey" FOREIGN KEY ("connectSentenceRightId") REFERENCES "ConnectSentenceItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConnectSentenceItem" ADD CONSTRAINT "ConnectSentenceItem_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Blank" ADD CONSTRAINT "Blank_fillInTheBlankItemId_fkey" FOREIGN KEY ("fillInTheBlankItemId") REFERENCES "FillInTheBlankItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
