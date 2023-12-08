const jwt = require("jsonwebtoken");

const createUserToken = async (user, req, res) => {
  try {
    const secret = process.env.SECRET;

    const token = jwt.sign(
      {
        name: user.name,
        id: user._id,
      },
      secret
    );

    res.status(200).json({
      token,
      userId: user._id,
      message: "Usuário autenticado com sucesso!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Falha ao criar token de usuário." });
  }
};

module.exports = createUserToken;
