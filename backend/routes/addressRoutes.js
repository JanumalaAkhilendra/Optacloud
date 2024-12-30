const express = require("express");
const Address = require(__dirname + "/../models/addressModel.js");

const router = express.Router();

// Get all addresses
router.get("/", async (req, res) => {
  try {
    const addresses = await Address.find();
    res.json(addresses);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch addresses" });
  }
});

// Add a new address
router.post("/", async (req, res) => {
  const { houseNo, area, category, landmark, address } = req.body;
  console.log(req.body);
  try {
    const newAddress = new Address({
      houseNo,
      area,
      category,
      landmark,
      address,
    });
    await newAddress.save();
    res.status(201).json(newAddress);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to save address" });
  }
});

// Update specific fields of an address
router.patch("/:id", async (req, res) => {
  const updates = req.body; // Partial updates provided by the client
  try {
    const updatedAddress = await Address.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true } // Return updated document and run validators
    );
    if (!updatedAddress)
      return res.status(404).json({ error: "Address not found" });
    res.json(updatedAddress);
  } catch (err) {
    res.status(500).json({ error: "Failed to update address" });
  }
});

// Delete an address
router.delete("/:id", async (req, res) => {
  try {
    const address = await Address.findByIdAndDelete(req.params.id);
    if (!address) return res.status(404).json({ error: "Address not found" });
    res.json({ message: "Address deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete address" });
  }
});

module.exports = router;
