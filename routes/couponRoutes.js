const express = require('express');
const { createCoupon, getAllCoupons, updateCoupon, deleteCoupon } = require('../controller/couponCtrl');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware')
const router = express.Router();

router.post('/create', authMiddleware, isAdmin, createCoupon)
router.get('', authMiddleware, isAdmin, getAllCoupons)
router.put('/update/:id', authMiddleware, isAdmin, updateCoupon)
router.put('/delete/:id', authMiddleware, isAdmin, deleteCoupon)

module.exports = router;