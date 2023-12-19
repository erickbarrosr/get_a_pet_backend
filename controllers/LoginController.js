const User = require("../models/User");
const createUserToken = require("../helpers/create-user-token");
const getToken = require("../helpers/get-token");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = class LoginController {
  static async authenticateUser(req, res) {
    try {
      const { email, password } = req.body;

      if (!email) {
        return res.status(422).json({ message: "O email é obrigatório." });
      }

      if (!password) {
        return res.status(422).json({ message: "A senha é obrigatória." });
      }

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "Usuário não cadastrado." });
      }

      const checkPassword = await bcrypt.compare(password, user.password);

      if (!checkPassword) {
        return res.status(400).json({ message: "Senha incorreta." });
      }

      await createUserToken(user, req, res);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Falha ao fazer login." });
    }
  }

  static async checkIfUserIsLoggedIn(req, res) {
    try {
      let currentUser;

      if (req.headers.authorization) {
        const token = getToken(req);

        const decoded = jwt.verify(token, process.env.SECRET);

        currentUser = await User.findById(decoded.id);

        currentUser.password = undefined;
      } else {
        currentUser = null;
      }

      res.status(200).send(currentUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Falha ao verificar login do usuário." });
    }
  }
};
