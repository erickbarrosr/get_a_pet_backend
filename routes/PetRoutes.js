const PetController = require("../controllers/PetController");
const verifyToken = require("../helpers/verify-token");

const router = require("express").Router();

router.post("/register", verifyToken, PetController.registerPet);

module.exports = router;
