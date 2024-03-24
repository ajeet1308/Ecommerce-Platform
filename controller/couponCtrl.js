const Coupon = require("../models/couponModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongoDBId");

const createCoupon = asyncHandler(async (req, res) => {
  try {
    const newCoupon = await Coupon.create(req.body);
    res.json(newCoupon);
  } catch (error) {
    throw new Error(error);
  }
});

// get all coupons
const getAllCoupons = asyncHandler(async (req, res) => {
  try {
    const allCoupon = await Coupon.find();
    res.json(allCoupon);
  } catch (error) {
    throw new Error(error);
  }
});

// update Coupon
const updateCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const updatedCoupon = await Coupon.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedCoupon)
  } catch (error) {
    throw new Error(error);
  }
});

// delete Coupon
const deleteCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
      const deletedCoupon = await Coupon.findByIdAndDelete(id);
      if (!deletedCoupon) return res.status(404).send({message: "Coupon does not exists"});
      res.json({message: 'Coupon Deleted Successfully'})
    } catch (error) {
      throw new Error(error);
    }
  });
module.exports = {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon
};
