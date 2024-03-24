const Category = require("../models/prodCategoryModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongoDBId");

const createCategory = asyncHandler(async (req, res) => {
  try {
    const newCategory = await Category.create(req.body);
    res.json(newCategory);
  } catch (error) {
    throw new Error(error);
  }
});

// Update Category
const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const updatedCategory = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedCategory) {
      return res.status(404).send({ message: "Category not found" });
    }
    res.json(updatedCategory);
  } catch (error) {
    throw new Error(error);
  }
});

// delete Category
const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory)
      return res.status(404).send({ message: "Category not found" });
    res.json({ message: "Category Deletion Successful!" });
  } catch (error) {
    throw new Error(error);
  }
});

// get all category
const getAllCategory = asyncHandler(async (req, res) => {
  try {
    const allCategory = await Category.find();
    res.json(allCategory);
  } catch (error) {
    throw new Error(error);
  }
});

// get single category
const getSingleCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const category = await Category.findById(id);
    if (!category) res.status(404).send({ message: "Category not found" });
    res.json(category);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = { createCategory, updateCategory, deleteCategory, getAllCategory, getSingleCategory };
