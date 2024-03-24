const express = require("express");
const { createBlog, updateBlog, getAllBlog, deleteBlog, getSingleBlog, likeBlog, dislikeBlog } = require("../controller/blogCtrl");
const {authMiddleware, isAdmin} = require('../middlewares/authMiddleware')
const router = express.Router();

router.post('/create',authMiddleware, isAdmin, createBlog)
router.put('/update/:id', authMiddleware, isAdmin, updateBlog)
router.get('', authMiddleware, getAllBlog)
router.get('/:id', authMiddleware, getSingleBlog)
router.delete('/delete/:id', authMiddleware, isAdmin, deleteBlog)

router.put('/likes', authMiddleware, isAdmin, likeBlog)
router.put('/dislikes', authMiddleware, isAdmin, dislikeBlog)

module.exports = router;