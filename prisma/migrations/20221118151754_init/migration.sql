-- CreateEnum
CREATE TYPE "ExerciseSegmentType" AS ENUM ('TEXT', 'BLANK');

-- CreateTable
CREATE TABLE "Book" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "edition" INTEGER,
    "publisher" TEXT NOT NULL,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Unit" (
    "id" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "subTitle" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,

    CONSTRAINT "Unit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exercise" (
    "id" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "instruction" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,

    CONSTRAINT "Exercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExerciseItem" (
    "id" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "exerciseId" TEXT NOT NULL,

    CONSTRAINT "ExerciseItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExerciseSegment" (
    "id" TEXT NOT NULL,
    "type" "ExerciseSegmentType" NOT NULL,
    "content" TEXT[],
    "exerciseItemId" TEXT NOT NULL,

    CONSTRAINT "ExerciseSegment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Book_title_edition_publisher_key" ON "Book"("title", "edition", "publisher");

-- CreateIndex
CREATE UNIQUE INDEX "Unit_bookId_number_key" ON "Unit"("bookId", "number");

-- CreateIndex
CREATE UNIQUE INDEX "Exercise_unitId_number_key" ON "Exercise"("unitId", "number");

-- AddForeignKey
ALTER TABLE "Unit" ADD CONSTRAINT "Unit_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exercise" ADD CONSTRAINT "Exercise_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExerciseItem" ADD CONSTRAINT "ExerciseItem_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExerciseSegment" ADD CONSTRAINT "ExerciseSegment_exerciseItemId_fkey" FOREIGN KEY ("exerciseItemId") REFERENCES "ExerciseItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
