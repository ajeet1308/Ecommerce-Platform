const express = require("express");
const { createProduct, getAllProduct, getAProduct, updateProduct, deleteAProduct } = require("../controller/productCtrl");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get('/all-product', getAllProduct)
router.get('/detail/:id', getAProduct)
router.post('/create-product', authMiddleware, isAdmin, createProduct)
router.put('/update/:id', authMiddleware, isAdmin, updateProduct)
router.delete('/delete/:id', authMiddleware, isAdmin, deleteAProduct)

module.exports = router;