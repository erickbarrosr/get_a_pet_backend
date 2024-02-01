const Pet = require("../models/Pet");
const getToken = require("../helpers/get-token");
const getUserByToken = require("../helpers/get-user-by-token");

module.exports = class PetController {
  static async registerPet(req, res) {
    try {
      const { name, age, weight, color } = req.body;

      const available = true;

      if (!name) {
        return res.status(422).json({ message: "O nome é obrigatório." });
      }

      if (!age) {
        return res.status(422).json({ message: "A idade é obrigatória." });
      }

      if (!weight) {
        return res.status(422).json({ message: "O peso é obrigatório." });
      }

      if (!color) {
        return res.status(422).json({ message: "A cor é obrigatória." });
      }

      const token = getToken(req);
      const user = await getUserByToken(token);

      const pet = new Pet({
        name,
        age,
        weight,
        color,
        available,
        images: [],
        user: {
          _id: user._id,
          name: user.name,
          image: user.image,
          phone: user.phone,
        },
      });

      const newPet = await pet.save();

      res.status(201).json({ message: "Pet cadastrado com sucesso!", newPet });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Falha ao registrar Pet." });
    }
  }
};
