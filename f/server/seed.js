import mongoose from "mongoose"
import dotenv from "dotenv"
import Food from "./models/Food.js"

// Load environment variables
dotenv.config()

// Connect to MongoDB
mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb+srv://tamildubdowshield29:u1lxgV7wfXm1lMEw@cluster0.mongodb.net/foodbtwo",
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err))

// Sample food data
const foodData = [
  {
    name: "Margherita Pizza",
    description: "Classic pizza with tomato sauce, mozzarella, and fresh basil.",
    price: 12.99,
    image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=600&h=400",
    category: "Pizza",
    isAvailable: true,
  },
  {
    name: "Pepperoni Pizza",
    description: "Traditional pizza topped with pepperoni slices and mozzarella cheese.",
    price: 14.99,
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&h=400",
    category: "Pizza",
    isAvailable: true,
  },
  {
    name: "Vegetable Supreme Pizza",
    description: "Loaded with bell peppers, onions, mushrooms, olives, and tomatoes.",
    price: 13.99,
    image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=600&h=400",
    category: "Pizza",
    isAvailable: true,
  },
  {
    name: "Classic Burger",
    description: "Juicy beef patty with lettuce, tomato, onion, and special sauce.",
    price: 9.99,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&h=400",
    category: "Burger",
    isAvailable: true,
  },
  {
    name: "Cheese Burger",
    description: "Classic burger with melted cheddar cheese and all the fixings.",
    price: 10.99,
    image: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?auto=format&fit=crop&w=600&h=400",
    category: "Burger",
    isAvailable: true,
  },
  {
    name: "Chicken Burger",
    description: "Grilled chicken breast with avocado, bacon, and honey mustard.",
    price: 11.99,
    image: "https://images.unsplash.com/photo-1615297319597-580b11ee7caa?auto=format&fit=crop&w=600&h=400",
    category: "Burger",
    isAvailable: true,
  },
  {
    name: "Caesar Salad",
    description: "Crisp romaine lettuce with Caesar dressing, croutons, and parmesan.",
    price: 8.99,
    image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=600&h=400",
    category: "Salad",
    isAvailable: true,
  },
  {
    name: "Greek Salad",
    description: "Fresh cucumber, tomato, olives, and feta cheese with olive oil dressing.",
    price: 9.99,
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&h=400",
    category: "Salad",
    isAvailable: true,
  },
  {
    name: "Chicken Pasta",
    description: "Fettuccine pasta with grilled chicken in creamy alfredo sauce.",
    price: 13.99,
    image: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?auto=format&fit=crop&w=600&h=400",
    category: "Pasta",
    isAvailable: true,
  },
  {
    name: "Spaghetti Bolognese",
    description: "Classic spaghetti with rich meat sauce and parmesan cheese.",
    price: 12.99,
    image: "https://images.unsplash.com/photo-1622973536968-3ead9e780960?auto=format&fit=crop&w=600&h=400",
    category: "Pasta",
    isAvailable: true,
  },
  {
    name: "French Fries",
    description: "Crispy golden fries seasoned with salt and herbs.",
    price: 4.99,
    image: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&w=600&h=400",
    category: "Sides",
    isAvailable: true,
  },
  {
    name: "Onion Rings",
    description: "Crispy battered onion rings served with dipping sauce.",
    price: 5.99,
    image: "https://images.unsplash.com/photo-1639024471283-03518883512d?auto=format&fit=crop&w=600&h=400",
    category: "Sides",
    isAvailable: true,
  },
]

// Seed function
const seedDatabase = async () => {
  try {
    // Clear existing data
    await Food.deleteMany({})
    console.log("Cleared existing food data")

    // Insert new data
    await Food.insertMany(foodData)
    console.log("Successfully seeded food data")

    // Disconnect from database
    mongoose.disconnect()
  } catch (error) {
    console.error("Error seeding database:", error)
    process.exit(1)
  }
}

// Run the seed function
seedDatabase()

