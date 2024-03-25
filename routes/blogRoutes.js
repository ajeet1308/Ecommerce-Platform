const express = require("express");
const { createBlog, updateBlog, getAllBlog, deleteBlog, getSingleBlog, likeBlog, dislikeBlog, uploadImages } = require("../controller/blogCtrl");
const {authMiddleware, isAdmin} = require('../middlewares/authMiddleware');
const { uploadPhoto, blogImgResize } = require("../middlewares/uploadImages");
const router = express.Router();

router.post('/create',authMiddleware, isAdmin, createBlog)
router.put('/update/:id', authMiddleware, isAdmin, updateBlog)
router.get('', authMiddleware, getAllBlog)
router.get('/:id', authMiddleware, getSingleBlog)
router.delete('/delete/:id', authMiddleware, isAdmin, deleteBlog)

router.put('/likes', authMiddleware, isAdmin, likeBlog)
router.put('/dislikes', authMiddleware, isAdmin, dislikeBlog)
router.put(
    "/upload/:id",
    authMiddleware,
    isAdmin,
    uploadPhoto.array("images", 10),
    blogImgResize,
    uploadImages
  );

module.exports = router;