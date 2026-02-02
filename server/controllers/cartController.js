import User from "../models/User.js"

// Update User CartData : /api/cart/update


export const updateCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cartItems = req.body.cartItems; // this is already an ARRAY now

    if (!Array.isArray(cartItems)) {
      return res.json({ success: false, message: "Cart format invalid" });
    }

    await User.findByIdAndUpdate(userId, { cartItems });

    res.json({ success: true, message: "Cart Updated" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};


