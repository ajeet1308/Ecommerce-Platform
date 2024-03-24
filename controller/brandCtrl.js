const Brand = require("../models/brandModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongoDBId");

const createBrand = asyncHandler(async (req, res) => {
  try {
    const newBrand = await Brand.create(req.body);
    res.json(newBrand);
  } catch (error) {
    throw new Error(error);
  }
});

// Update Brand
const updateBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const updatedBrand = await Brand.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedBrand) {
      return res.status(404).send({ message: "Brand not found" });
    }
    res.json(updatedBrand);
  } catch (error) {
    throw new Error(error);
  }
});

// delete Brand
const deleteBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deletedBrand = await Brand.findByIdAndDelete(id);
    if (!deletedBrand)
      return res.status(404).send({ message: "Brand not found" });
    res.json({ message: "Brand Deletion Successful!" });
  } catch (error) {
    throw new Error(error);
  }
});

// get all Brand
const getAllBrand = asyncHandler(async (req, res) => {
  try {
    const allBrand = await Brand.find();
    res.json(allBrand);
  } catch (error) {
    throw new Error(error);
  }
});

// get single Brand
const getSingleBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log(id);
  validateMongoDbId(id);
  try {
    const brand = await Brand.findById(id);
    if (!brand) res.status(404).send({ message: "Brand not found" });
    res.json(brand);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = { createBrand, updateBrand, deleteBrand, getAllBrand, getSingleBrand };