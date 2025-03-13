import express from "express"
import Order from "../models/Order.js"
import Cart from "../models/Cart.js"
import { auth } from "../middleware/auth.js"

const router = express.Router()

// Get user's orders
router.get("/", auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate("items.food").sort({ createdAt: -1 })

    res.json(orders)
  } catch (error) {
    console.error("Get orders error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get order by ID
router.get("/:id", auth, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.id,
    }).populate("items.food")

    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    res.json(order)
  } catch (error) {
    console.error("Get order error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Create new order
router.post("/", auth, async (req, res) => {
  try {
    const { items, deliveryAddress, paymentMethod, note, deliveryFee, total } = req.body

    // Create order
    const order = new Order({
      user: req.user.id,
      items,
      deliveryAddress,
      paymentMethod,
      note,
      deliveryFee,
      total,
      status: "pending",
      paymentStatus: paymentMethod === "cash" ? "pending" : "paid",
    })

    await order.save()

    // Clear user's cart
    await Cart.deleteMany({ user: req.user.id })

    res.status(201).json(order)
  } catch (error) {
    console.error("Create order error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Cancel order
router.put("/:id/cancel", auth, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.id,
    })

    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    // Only allow cancellation if order is pending or confirmed
    if (order.status !== "pending" && order.status !== "confirmed") {
      return res.status(400).json({ message: "Order cannot be cancelled at this stage" })
    }

    order.status = "cancelled"
    await order.save()

    res.json(order)
  } catch (error) {
    console.error("Cancel order error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

export default router

