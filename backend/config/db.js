const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    // ↑ बस यही काफी है! useNewUrlParser और useUnifiedTopology remove कर दिया
    console.log("MongoDB connected ✅");
  } catch (error) {
    console.error("MongoDB connection failed ❌");
    console.error("Error details:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;