import express from "express"
import Food from "../models/Food.js"

const router = express.Router()

// Get all foods
router.get("/", async (req, res) => {
  try {
    const foods = await Food.find({ isAvailable: true })
    res.json(foods)
  } catch (error) {
    console.error("Get foods error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get food by ID
router.get("/:id", async (req, res) => {
  try {
    const food = await Food.findById(req.params.id)
    if (!food) {
      return res.status(404).json({ message: "Food not found" })
    }
    res.json(food)
  } catch (error) {
    console.error("Get food error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get recommended foods
router.get("/recommended/:id", async (req, res) => {
  try {
    const food = await Food.findById(req.params.id)
    if (!food) {
      return res.status(404).json({ message: "Food not found" })
    }

    // Get foods in the same category, excluding the current one
    const recommendedFoods = await Food.find({
      _id: { $ne: req.params.id },
      category: food.category,
      isAvailable: true,
    }).limit(3)

    res.json(recommendedFoods)
  } catch (error) {
    console.error("Get recommended foods error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

export default router

