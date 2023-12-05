const mongoose = require("mongoose");

async function connectToDatabase() {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.iemu0gc.mongodb.net/get-a-pet`
    );

    console.log("Database connected successfully!");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro interno do servidor!" });
  }
}

module.exports = connectToDatabase;
