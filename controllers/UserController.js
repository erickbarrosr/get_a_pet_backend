const User = require("../models/User");

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
    const id = req.params.id;

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Usuaŕio não encontrado." });
    }

    res.status(200).json({ user });
  }
};
