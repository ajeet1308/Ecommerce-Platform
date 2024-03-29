const { generateToken } = require("../config/jwtToken");
const { generateRefreshToken } = require("../config/refreshToken");
const User = require("../models/userModel");
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");
const Order = require("../models/orderModel");
const CouponModel = require("../models/couponModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongoDBId");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendEmail } = require("./emailCtrl");
const uniqid = require("uniqid");
const createUser = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const findUser = await User.findOne({ email: email });
  if (!findUser) {
    // Create a new User
    const newUser = await User.create(req.body);
    res.json(newUser);
  } else {
    // User Already Exists
    throw new Error("User Already Exists");
  }
});

const loginUserCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // Checking user existance in the database
  const findUser = await User.findOne({ email });
  if (findUser && (await findUser.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(findUser?.id);
    const updateUser = await User.findByIdAndUpdate(
      findUser?.id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });

    res.json({
      _id: findUser?._id,
      firstname: findUser?.firstname,
      lastname: findUser?.lastname,
      email: findUser?.email,
      mobile: findUser?.mobile,
      token: generateToken(findUser?.id),
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});

// admin login

const loginAdminCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // Checking user existance in the database
  const findAdmin = await User.findOne({ email });
  if (findAdmin?.role !== "admin") throw new Error("Not Authorized");

  if (findAdmin && (await findAdmin.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(findAdmin?.id);
    const updateUser = await User.findByIdAndUpdate(
      findAdmin?.id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });

    res.json({
      _id: findAdmin?._id,
      firstname: findAdmin?.firstname,
      lastname: findAdmin?.lastname,
      email: findAdmin?.email,
      mobile: findAdmin?.mobile,
      token: generateToken(findAdmin?.id),
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});

// handle refresh token
const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) throw new Error("No Refresh token present in db or not matched");
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err || user.id !== decoded.id) {
      throw new Error("There is something wrong with refresh token");
    } else {
      const accessToken = generateToken(user?.id);
      res.json({ accessToken });
    }
  });
  res.json(user);
});

// logout functionality

const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204); // forbidden
  }
  await User.findOneAndUpdate(
    { refreshToken },
    {
      refreshToken: "",
    }
  );
  // remove the cookies from client side
  res.clearCookie("refreshtoken", {
    httpOnly: true,
    secure: true,
  });
  return res.status(200).json({ message: "Logged out Successfully" });
});

// Get all users
const getAllUser = asyncHandler(async (req, res) => {
  try {
    const getUsers = await User.find();
    res.json(getUsers);
  } catch (error) {
    throw new Error(error);
  }
});

// Get a single user
const getSingleUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const user = await User.findById(id);
    res.json(user);
  } catch (error) {
    throw new Error(error);
  }
});

// Delete a user
const deleteSingleUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.json({ message: "Deleted user successfully" });
  } catch (error) {
    throw new Error(error);
  }
});

// update a user
const updateSingleUser = asyncHandler(async (req, res) => {
  const { id } = req.user;
  validateMongoDbId(id);
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        firstname: req?.body?.firstname,
        lastname: req?.body?.lastname,
        email: req?.body?.email,
        mobile: req?.body?.mobile,
      },
      { new: true }
    );
    res.json(updatedUser);
  } catch (error) {
    throw new Error(error);
  }
});

const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const blockUser = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      { new: true }
    );
    res.json({ message: "User is blocked" });
  } catch (error) {
    throw new Error(error);
  }
});

const unBlockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const unBlockUser = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      { new: true }
    );
    res.json({ message: "User is unblocked" });
  } catch (error) {
    throw new Error(error);
  }
});

// update password
const updatePassword = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const { password } = req.body;
  validateMongoDbId(id);
  const user = await User.findById(id);
  if (password) {
    user.password = password;
    const updatedPassword = await user.save();
    res.json(updatedPassword);
  } else {
    res.json(user);
  }
});

const forgotPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found with this email");

  try {
    const token = await user.createPasswordResetToken();
    await user.save();
    const resetUrl = `Hi, Please follow this link to reset Your Password. This link is valid till 10 minutes from now. <a href='http://localhost:5000/api/user/reset-password/${token}'>Click here</a>`;
    const data = {
      to: email,
      text: "Hey User",
      subject: "Forgot Password Link",
      html: resetUrl,
    };
    sendEmail(data);
    res.json(token);
  } catch (error) {
    throw new Error(error);
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) throw new Error("Token Expired, Please try again later");
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  res.json(user);
});

// get wishlist
const getWishlist = asyncHandler(async (req, res) => {
  console.log(req.user);
  const { id } = req.user;
  try {
    const findUser = await User.findById(id)?.populate("wishlist");
    res.json(findUser);
  } catch (error) {
    throw new Error(error);
  }
});

// save user address

const saveAddress = asyncHandler(async (req, res) => {
  const { id } = req.user;
  validateMongoDbId(id);
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        address: req?.body?.address,
      },
      { new: true }
    );
    res.json(updatedUser);
  } catch (error) {
    throw new Error(error);
  }
});

const userCart = asyncHandler(async (req, res) => {
  console.log(req.user);
  const { id } = req.user;
  const { cart } = req.body;
  validateMongoDbId(id);

  try {
    let products = [];
    const user = await User.findById(id);
    // check if user already have product in cart
    const alreadyExistCart = await Cart.findOne({ orderby: user.id });
    if (alreadyExistCart) {
      alreadyExistCart.remove();
    }
    for (let i = 0; i < cart.length; i++) {
      let object = {};
      object.product = cart[i].id;
      object.count = cart[i].count;
      object.color = cart[i].color;
      let getPrice = await Product.findById(cart[i].id).select("price").exec();
      object.price = getPrice.price;
      products.push(object);
    }
    let cartTotal = 0;
    for (let i = 0; i < products.length; i++) {
      cartTotal += products[i].price * products[i].count;
    }
    let newCart = await new Cart({
      products,
      cartTotal,
      orderby: user?.id,
    }).save();
    res.json(newCart);
  } catch (error) {
    throw new Error(error);
  }
});

const getUserCart = asyncHandler(async (req, res) => {
  const { id } = req.user;
  validateMongoDbId(id);

  try {
    const cart = await Cart.findOne({ orderby: id }).populate(
      "products.product"
    );
    res.json(cart);
  } catch (error) {
    throw new Error(error);
  }
});

const emptyCart = asyncHandler(async (req, res) => {
  const { id } = req.user;
  validateMongoDbId(id);

  try {
    const user = await User.findById(id);
    const cart = await Cart.findOneAndDelete({ orderby: user.id });
    res.json(cart);
  } catch (error) {
    throw new Error(error);
  }
});

const applyCoupon = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const { coupon } = req.body;
  try {
    const validCoupon = await CouponModel.findOne({ name: coupon });
    if (validCoupon === null) {
      throw new Error("Invalid Coupon");
    }
    const user = await User.findById(id);
    console.log(user);
    let { cartTotal } = await Cart.findOne({
      orderby: user.id,
    }).populate("products.product");
    let totalAfterDiscount = (
      cartTotal -
      (cartTotal * validCoupon.discount) / 100
    ).toFixed(2);
    await Cart.findOneAndUpdate(
      { orderby: user.id },
      { totalAfterDiscount },
      { new: true }
    );
    res.json(totalAfterDiscount);
  } catch (error) {
    throw new Error(error);
  }
});

const createOrder = asyncHandler(async (req, res) => {
  const { COD, couponApplied } = req.body;
  const { id } = req.user;
  validateMongoDbId(id);
  try {
    if (!COD) {
      throw new Error("Create Cash Order failed");
    }
    const user = await User.findById(id);
    const userCart = await Cart.findOne({ orderby: user.id });
    let finalAmount = 0;
    if (couponApplied && userCart.totalAfterDiscount) {
      finalAmount = userCart.totalAfterDiscount;
    } else {
      finalAmount = userCart.cartTotal;
    }
    let newOrder = await new Order({
      products: userCart.products,
      paymentIntent: {
        id: uniqid(),
        method: "COD",
        amount: finalAmount,
        status: "Cash on Delivery",
        created: Date.now(),
        currency: "usd",
      },
      orderby: user.id,
      orderStatus: "Cash on Delivery",
    }).save();
    let update = userCart.products.map((item) => {
      return {
        updateOne: {
          filter: { id: item.product.id },
          update: { $inc: { quantity: -item.count, sold: +item.count } },
        },
      };
    });
    const updated = await Product.bulkWrite(update, {});
    res.json({ message: "success" });
  } catch (error) {
    throw new Error(error);
  }
});

const getOrders = asyncHandler(async (req, res) => {
  const { id } = req.user;
  validateMongoDbId(id);
  console.log(id);
  try {
    const userOrders = await Order.findOne({ orderby: id })
      .populate("products.product")
      .exec();
    res.json(userOrders);
  } catch (error) {
    throw new Error(error);
  }
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const updateOrder = await Order.findByIdAndUpdate(
      id,
      {
        orderStatus: status,
        paymentIntent: {
          status: status,
        }
      },
      { new: true }
    );
    res.json(updateOrder)
  } catch (error) {
    throw new Error(error)
  }
});

module.exports = {
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
  updateOrderStatus,
};
