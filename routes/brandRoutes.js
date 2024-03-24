const express = require('express');
const { createBrand, updateBrand, deleteBrand, getAllBrand, getSingleBrand } = require('../controller/brandCtrl');
const router = express.Router();
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware' );

router.post('/create', authMiddleware, isAdmin, createBrand)
router.put('/update/:id', authMiddleware, isAdmin, updateBrand)
router.delete('/delete/:id', authMiddleware, isAdmin, deleteBrand)
router.get('', authMiddleware, isAdmin, getAllBrand)
router.get('/:id', authMiddleware, isAdmin, getSingleBrand)

module.exports = router;