const appController = require("../controllers/app.controller");
const appMiddleware = require("../middlewares/app.middleware");
const express = require("express");
const router = express.Router();

router.post("/signup", appMiddleware.validateSignUpForm, appController.SignUp);
router.post("/login", appMiddleware.validateLoginForm, appController.login);
router.post("/mark", appMiddleware.verifyToken, appController.addLibrary);
router.get("/user/library",appMiddleware.checkUserId
,appController.getAllLibrary
);
router.get("/library/:user_id", appController.getAllLibrary
);
router.get("/library/:user_id/:anime_id", appController.getAnimeLibraryById);
router.delete("/mark/:library_id", appController.deleteAnimeLibrary);
module.exports = {
  appRouter: router,
};
