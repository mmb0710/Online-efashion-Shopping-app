import dotenv from "dotenv";
import Razorpay from "razorpay";
import crypto from "crypto";
import { asyncHandler } from "../utils/asyncHandler.js";

dotenv.config();

// Razorpay Instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ Create Razorpay Order
export const createRazorpayOrder = asyncHandler(async (req, res) => {
  try {
    const { amount, currency = "INR" } = req.body;

    if (!amount) {
      return res.status(400).json({ error: "Amount is required" });
    }

    const options = {
      amount: Math.round(amount), // amount should already be in paise
      currency,
      receipt: `order_rcptid_${Math.floor(Math.random() * 10000)}`,
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error("🔴 Razorpay Create Order Error:", error);
    res.status(500).json({
      success: false,
      message: "Could not create Razorpay order",
    });
  }
});

// ✅ Verify Razorpay Payment
export const verifyRazorpayOrder = asyncHandler(async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    // Log incoming request for debugging
    console.log("🔍 Verifying Razorpay Payment", {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    // Basic validation
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Missing parameters" });
    }

    // Signature verification
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature === razorpay_signature) {
      console.log("✅ Razorpay Payment Verified:", razorpay_payment_id);
      return res.status(200).json({
        success: true,
        message: "Payment verified successfully",
      });
    } else {
      console.warn("❌ Signature mismatch");
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }
  } catch (error) {
    console.error("🔴 Razorpay Verification Error:", error);
    res.status(400).json({
      success: false,
      message: "Error while verifying Razorpay payment",
    });
  }
});
