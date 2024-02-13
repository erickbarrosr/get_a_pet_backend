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

router.get("/:id", PetController.showPet);

router.delete("/:id", verifyToken, PetController.removePet);

router.patch(
  "/:id",
  verifyToken,
  imageUpload.array("images"),
  PetController.updatePet
);

router.patch("/schedule/:id", verifyToken, PetController.scheduleVisit);

module.exports = router;
