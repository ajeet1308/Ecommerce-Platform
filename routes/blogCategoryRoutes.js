const express = require('express');
const { createCategory, updateCategory, deleteCategory, getAllCategory, getSingleCategory } = require('../controller/blogCategoryCtrl');
const router = express.Router();
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware' );

router.post('/create', authMiddleware, isAdmin, createCategory)
router.put('/update/:id', authMiddleware, isAdmin, updateCategory)
router.delete('/delete/:id', authMiddleware, isAdmin, deleteCategory)
router.get('', authMiddleware, isAdmin, getAllCategory)
router.get('/:id', authMiddleware, isAdmin, getSingleCategory)

module.exports = router;