const Pet = require("../models/Pet");
const getToken = require("../helpers/get-token");
const getUserByToken = require("../helpers/get-user-by-token");

const ObjectId = require("mongoose").Types.ObjectId;

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

  static async showPet(req, res) {
    try {
      const id = req.params.id;

      if (!ObjectId.isValid(id)) {
        return res.status(422).json({ message: "ID inválido." });
      }

      const pet = await Pet.findOne({ _id: id });

      if (!pet) {
        return res.status(404).json({ message: "Pet não encontrado." });
      }

      res.status(200).json({ pet });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao mostrar o pet." });
    }
  }

  static async removePet(req, res) {
    try {
      const id = req.params.id;

      if (!ObjectId.isValid(id)) {
        return res.status(422).json({ message: "ID inválido." });
      }

      const pet = await Pet.findOne({ _id: id });

      if (!pet) {
        return res.status(404).json({ message: "Pet não encontrado." });
      }

      const token = getToken(req);

      const user = await getUserByToken(token);

      if (
        !user ||
        !user._id ||
        !pet.user ||
        !pet.user._id ||
        pet.user._id.toString() !== user._id.toString()
      ) {
        return res
          .status(422)
          .json({ message: "Você não pode remover esse pet." });
      }

      await Pet.findByIdAndDelete(id);

      res.status(200).json({ message: "Pet removido com sucesso!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao remover Pet." });
    }
  }

  static async updatePet(req, res) {
    try {
      const { name, age, weight, color, available } = req.body;

      const images = req.files;

      const id = req.params.id;

      if (!ObjectId.isValid(id)) {
        return res.status(422).json({ message: "ID inválido." });
      }

      const updatedData = {};

      const pet = await Pet.findOne({ _id: id });

      if (!pet) {
        return res.status(404).json({ message: "Pet não encontrado." });
      }

      const token = getToken(req);

      const user = await getUserByToken(token);

      if (
        !user ||
        !user._id ||
        !pet.user ||
        !pet.user._id ||
        pet.user._id.toString() !== user._id.toString()
      ) {
        return res
          .status(422)
          .json({ message: "Você não pode atualizar esse pet." });
      }

      if (!name) {
        return res.status(422).json({ message: "O nome é obrigatório." });
      } else {
        updatedData.name = name;
      }

      if (!age) {
        return res.status(422).json({ message: "A idade é obrigatória." });
      } else {
        updatedData.age = age;
      }

      if (!weight) {
        return res.status(422).json({ message: "O peso é obrigatório." });
      } else {
        updatedData.weight = weight;
      }

      if (!color) {
        return res.status(422).json({ message: "A cor é obrigatória." });
      } else {
        updatedData.color = color;
      }

      if (images.length === 0) {
        return res.status(422).json({ message: "A imagem é obrigatória." });
      } else {
        updatedData.images = [];

        images.map((image) => {
          updatedData.images.push(image.filename);
        });
      }

      await Pet.findByIdAndUpdate(id, updatedData);

      res.status(200).json({ message: "Pet atualizado com sucesso!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao atualizar seu pet." });
    }
  }

  static async scheduleVisit(req, res) {
    try {
      const id = req.params.id;

      if (!ObjectId.isValid(id)) {
        return res.status(422).json({ message: "ID inválido." });
      }

      const pet = await Pet.findOne({ _id: id });

      if (!pet) {
        return res.status(404).json({ message: "Pet não encontrado." });
      }

      const token = getToken(req);

      const user = await getUserByToken(token);

      if (pet.user._id.equals(user._id)) {
        return res.status(422).json({
          message: "Você não pode agendar uma visita com seu próprio Pet.",
        });
      }

      if (pet.adopter) {
        if (pet.adopter._id.equals(user._id)) {
          return res
            .status(422)
            .json({ message: "Você já agendou uma visita para este pet." });
        }
      }

      pet.adopter = {
        _id: user._id,
        name: user.name,
        image: user.image,
      };

      await Pet.findByIdAndUpdate(id, pet);

      res.status(200).json({
        message: `Visita agendada com sucesso, entre em contato com ${pet.user.name} pelo telefone ${pet.user.phone}.`,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao agendar sua visita." });
    }
  }
};
