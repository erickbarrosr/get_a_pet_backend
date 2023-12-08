const router = require("express").Router();
const UserController = require("../controllers/UserController");
const LoginController = require("../controllers/LoginController");

router.post("/register", UserController.register);
router.post("/login", LoginController.login);
router.get("/check", LoginController.checkIfUserIsLoggedIn);

module.exports = router;
