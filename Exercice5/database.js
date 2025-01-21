const mongoose = require("mongoose");
const { get } = require("nconf");

const uri = "mongodb://127.0.0.1:27024/mern-pool"; // Connexion à la base 'mern-pool'

const connectDB = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connection successful");
  } catch (error) {
    console.log("MongoDB connection failed:", error);
    process.exit(1); // Arrêter l'application si la connexion échoue
  }
};

module.exports = { connectDB };
