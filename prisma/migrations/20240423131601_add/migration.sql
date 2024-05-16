-- CreateTable
CREATE TABLE "CategoriesOnMovies" (
    "movieId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CategoriesOnMovies_pkey" PRIMARY KEY ("movieId","categoryId")
);

-- AddForeignKey
ALTER TABLE "CategoriesOnMovies" ADD CONSTRAINT "CategoriesOnMovies_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoriesOnMovies" ADD CONSTRAINT "CategoriesOnMovies_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
