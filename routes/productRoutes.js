const express = require("express");
const {
  createProduct,
  getAllProduct,
  getAProduct,
  updateProduct,
  deleteAProduct,
  addToWishList,
  totalRating,
} = require("../controller/productCtrl");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/all-product", getAllProduct);
router.get("/detail/:id", getAProduct);
router.put("/wishlist", authMiddleware, addToWishList);
router.put("/rating", authMiddleware, totalRating);

router.post("/create-product", authMiddleware, isAdmin, createProduct);
router.put("/update/:id", authMiddleware, isAdmin, updateProduct);
router.delete("/delete/:id", authMiddleware, isAdmin, deleteAProduct);

module.exports = router;
