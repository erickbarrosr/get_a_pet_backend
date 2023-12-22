const User = require("../models/User");
const getToken = require("../helpers/get-token");
const getUserByToken = require("../helpers/get-user-by-token");

const bcrypt = require("bcrypt");

module.exports = class UserController {
  static async registerUser(req, res) {
    try {
      const { name, email, phone, password, confirmPassword } = req.body;

      if (!name) {
        return res.status(422).json({ message: "O nome é obrigatório." });
      }

      if (!email) {
        return res.status(422).json({ message: "O email é obrigatório." });
      }

      if (!phone) {
        return res.status(422).json({ message: "O telefone é obrigatório." });
      }

      if (!password) {
        return res.status(422).json({ message: "Digite a sua senha." });
      }

      if (!confirmPassword) {
        return res.status(422).json({ message: "Confirme a sua senha." });
      }

      if (confirmPassword !== password) {
        return res.status(400).json({ message: "As senhas não conferem." });
      }

      const userExists = await User.findOne({ email });

      if (userExists) {
        return res.status(409).json({ message: "Usuário já está cadastrado." });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Falha ao registrar usuário." });
    }
  }

  static async getUserById(req, res) {
    try {
      const id = req.params.id;

      const user = await User.findById(id).select("-password");

      if (!user) {
        return res.status(404).json({ message: "Usuaŕio não encontrado." });
      }

      res.status(200).json({ user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Falha ao buscar usuário." });
    }
  }

  static async editUser(req, res) {
    try {
      const { name, email, phone, password, confirmPassword } = req.body;

      const id = req.params.id;

      const token = getToken(req);

      const user = await getUserByToken(token);

      if (!name) {
        return res.status(422).json({ message: "O nome é obrigatório." });
      }

      user.name = name;

      if (!email) {
        return res.status(422).json({ message: "O email é obrigatório." });
      }

      const userExists = await User.findOne({ email });

      if (user.email !== email && userExists) {
        return res
          .status(422)
          .json({ message: "Por favor, utilize outro e-mail!" });
      }

      user.email = email;

      if (!phone) {
        return res.status(422).json({ message: "O telefone é obrigatório." });
      }

      user.phone = phone;

      if (password != confirmPassword) {
        return res.status(422).json({ message: "As senhas não conferem!" });
      } else if (password === confirmPassword && password != null) {
        const salt = await bcrypt.genSalt(12);

        const passwordHash = await bcrypt.hash(password, salt);

        user.password = passwordHash;
      }

      await User.findOneAndUpdate(
        { _id: user._id },
        { $set: user },
        { new: true }
      );

      res.status(200).json({ message: "Usuário atualizado com sucesso!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Falha ao editar usuário." });
    }
  }
};
