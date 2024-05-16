import express from "express";
import * as userController from "../controllers/userController";

const userRouter = express.Router();

// movieRouter.get("/", movieController.getAllMovies);
// movieRouter.get("/:id", movieController.getMovieById);
// movieRouter.get("/:id/categories", getCategoriesByMovieId);
// movieRouter.get("/:id/image", getImageByMovieId);

userRouter.post("/account", userController.createAccount);

// movieRouter.put("/:id", movieController.updateMovie);
// movieRouter.put(
//   "/:id/categories/:categoryId",
//   movieController.addCategoryToMovie
// );

// movieRouter.delete("/:id", movieController.deleteMovie);
// movieRouter.delete(
//   "/:id/categories/:categoryId",
//   movieController.removeCategoryFromMovie
// );

export default userRouter;
