const express = require("express");
const {
  createUser,
  loginUserCtrl,
  getAllUser,
  getSingleUser,
  deleteSingleUser,
  updateSingleUser,
  blockUser,
  unBlockUser,
  handleRefreshToken,
  logout,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
  loginAdminCtrl,
  getWishlist,
  saveAddress,
  userCart,
  getUserCart,
  emptyCart,
  applyCoupon,
  createOrder,
  getOrders,
  updateOrderStatus
} = require("../controller/userCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/register", createUser);
router.post("/forgot-password-token", forgotPasswordToken)
router.post("/cart", authMiddleware, userCart);
router.post("/cart/applycoupon", authMiddleware, applyCoupon)
router.post("/cart/cash-order", authMiddleware, createOrder)
router.put("/reset-password/:token", resetPassword);
router.put("/update-order/:id", authMiddleware, isAdmin, updateOrderStatus);
router.put('/password', authMiddleware, updatePassword);
router.post("/login", loginUserCtrl);
router.post("/admin-login", loginAdminCtrl);
router.get("/wishlist", authMiddleware, getWishlist);
router.get("/get-order", authMiddleware, getOrders);
router.get("/get-cart", authMiddleware, getUserCart);
router.get("/all-users", getAllUser);
router.get("/refresh", handleRefreshToken);
router.get("/logout", logout);

router.get("/:id", authMiddleware, isAdmin, getSingleUser);
router.delete('/empty-cart', authMiddleware, emptyCart)
router.delete("/:id", deleteSingleUser);
router.put("/edit-user", authMiddleware, updateSingleUser);
router.put("/save-address", authMiddleware, saveAddress)
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unBlockUser);

module.exports = router;
