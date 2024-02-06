const PetController = require("../controllers/PetController");
const verifyToken = require("../helpers/verify-token");
const { imageUpload } = require("../helpers/image-upload");

const router = require("express").Router();

router.post(
  "/register",
  verifyToken,
  imageUpload.array("images"),
  PetController.registerPet
);

router.get("/", PetController.showAllPets);

router.get("/mypets", PetController.showUserPets);

router.get("/myadoptions", PetController.showUserAdoptions);

module.exports = router;
