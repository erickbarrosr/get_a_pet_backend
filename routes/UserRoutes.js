const router = require("express").Router();
const UserController = require("../controllers/UserController");
const LoginController = require("../controllers/LoginController");

router.post("/register", UserController.registerUser);
router.post("/login", LoginController.authenticateUser);
router.get("/check", LoginController.checkIfUserIsLoggedIn);
router.get("/:id", UserController.getUserById);

module.exports = router;
