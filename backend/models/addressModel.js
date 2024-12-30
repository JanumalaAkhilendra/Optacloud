const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema({
  houseNo: { type: String, required: true },
  area: { type: String, required: true },
  category: {
    type: String,
    enum: ["home", "business", "friends", "other"],
    required: true,
  },
  landmark: { type: String, required: true }, // New field for landmark
  address: { type: String, required: true }, // New field for the full address
});

module.exports = mongoose.model("Address", AddressSchema);
