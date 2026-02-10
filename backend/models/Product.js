const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      enum: ["gifts", "birthday", "anniversary", "flowers", "chocolates", "toys"],
      default: "gifts",
    },
    image: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      trim: true,
    },
    trending: {
      type: Boolean,
      default: false,
    },
    onSale: {
      type: Boolean,
      default: false,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);