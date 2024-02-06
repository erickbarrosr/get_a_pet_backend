const Pet = require("../models/Pet");
const getToken = require("../helpers/get-token");
const getUserByToken = require("../helpers/get-user-by-token");

module.exports = class PetController {
  static async registerPet(req, res) {
    try {
      const { name, age, weight, color } = req.body;

      const images = req.files;

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

      if (images.length === 0) {
        return res.status(422).json({ message: "A imagem é obrigatória." });
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

      images.map((image) => {
        pet.images.push(image.filename);
      });

      const newPet = await pet.save();

      res.status(201).json({ newPet, message: "Pet cadastrado com sucesso!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Falha ao registrar Pet." });
    }
  }

  static async showAllPets(req, res) {
    try {
      const pets = await Pet.find().sort("-createdAt");

      res.status(200).json({ pets });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao mostrar todos os Pets." });
    }
  }

  static async showUserPets(req, res) {
    try {
      const token = getToken(req);

      const user = await getUserByToken(token);

      const pets = await Pet.find({ "user._id": user._id }).sort("-createdAt");

      res.status(200).json({ pets });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao mostrar pets do usuário." });
    }
  }

  static async showUserAdoptions(req, res) {
    try {
      const token = getToken(req);

      const user = await getUserByToken(token);

      const pets = await Pet.find({ "adopter._id": user._id }).sort(
        "-createdAt"
      );

      res.status(200).json({ pets });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao mostrar adoções do usuário." });
    }
  }
};
