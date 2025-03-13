import express from "express"
import Cart from "../models/Cart.js"
import { auth } from "../middleware/auth.js"

const router = express.Router()

// Get user's cart
router.get("/", auth, async (req, res) => {
  try {
    const cartItems = await Cart.find({ user: req.user.id }).populate("food")
    res.json(cartItems)
  } catch (error) {
    console.error("Get cart error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Add item to cart
router.post("/", auth, async (req, res) => {
  try {
    const { foodId, quantity } = req.body

    // Check if item already in cart
    let cartItem = await Cart.findOne({ user: req.user.id, food: foodId })

    if (cartItem) {
      // Update quantity if already in cart
      cartItem.quantity += quantity
      await cartItem.save()
    } else {
      // Add new item to cart
      cartItem = new Cart({
        user: req.user.id,
        food: foodId,
        quantity,
      })
      await cartItem.save()
    }

    res.status(201).json(cartItem)
  } catch (error) {
    console.error("Add to cart error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update cart item quantity
router.put("/:id", auth, async (req, res) => {
  try {
    const { quantity } = req.body

    const cartItem = await Cart.findOne({
      _id: req.params.id,
      user: req.user.id,
    })

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" })
    }

    cartItem.quantity = quantity
    await cartItem.save()

    res.json(cartItem)
  } catch (error) {
    console.error("Update cart error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Remove item from cart
router.delete("/:id", auth, async (req, res) => {
  try {
    const cartItem = await Cart.findOne({
      _id: req.params.id,
      user: req.user.id,
    })

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" })
    }

    await cartItem.remove()

    res.json({ message: "Item removed from cart" })
  } catch (error) {
    console.error("Remove from cart error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

export default router

