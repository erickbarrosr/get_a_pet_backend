const router = require("express").Router();
const UserController = require("../controllers/UserController");
const LoginController = require("../controllers/LoginController");
const verifyToken = require("../helpers/verify-token");

router.post("/register", UserController.registerUser);
router.post("/login", LoginController.authenticateUser);
router.get("/check", LoginController.checkIfUserIsLoggedIn);
router.get("/:id", UserController.getUserById);
router.patch("/edit/:id", verifyToken, UserController.editUser);

module.exports = router;
