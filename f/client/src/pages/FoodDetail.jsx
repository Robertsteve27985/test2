"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-hot-toast"
import { Minus, Plus, ShoppingCart } from "lucide-react"
import { useAuth } from "../context/AuthContext"

const FoodDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [food, setFood] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [recommendedFoods, setRecommendedFoods] = useState([])

  useEffect(() => {
    const fetchFoodDetails = async () => {
      try {
        setLoading(true)
        const res = await axios.get(`/api/foods/${id}`)
        setFood(res.data)

        // Fetch recommended foods
        const recommendedRes = await axios.get(`/api/foods/recommended/${id}`)
        setRecommendedFoods(recommendedRes.data)
      } catch (error) {
        console.error("Error fetching food details:", error)
        toast.error("Failed to load food details")
      } finally {
        setLoading(false)
      }
    }

    fetchFoodDetails()
  }, [id])

  const handleQuantityChange = (value) => {
    const newQuantity = quantity + value
    if (newQuantity >= 1) {
      setQuantity(newQuantity)
    }
  }

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please login to add items to cart")
      navigate("/login")
      return
    }

    try {
      await axios.post("/api/cart", {
        foodId: food._id,
        quantity,
      })
      toast.success("Added to cart successfully")
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add to cart")
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!food) {
    return (
      <div className="text-center py-8">
        <p className="text-xl text-gray-600">Food item not found</p>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="rounded-lg overflow-hidden">
          <img
            src={food.image || "/placeholder.svg"}
            alt={food.name}
            className="w-full h-auto object-cover"
            onError={(e) => {
              e.target.onerror = null
              e.target.src = "/placeholder.svg?height=400&width=600"
            }}
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2">{food.name}</h1>
          <div className="flex items-center mb-4">
            <span className="bg-orange-100 text-orange-800 text-sm font-medium px-2.5 py-0.5 rounded">
              {food.category}
            </span>
          </div>

          <p className="text-gray-700 mb-6">{food.description}</p>

          <div className="text-2xl font-bold text-orange-600 mb-6">${food.price.toFixed(2)}</div>

          <div className="flex items-center mb-6">
            <button onClick={() => handleQuantityChange(-1)} className="p-2 border rounded-l-lg hover:bg-gray-100">
              <Minus size={20} />
            </button>
            <span className="px-6 py-2 border-t border-b">{quantity}</span>
            <button onClick={() => handleQuantityChange(1)} className="p-2 border rounded-r-lg hover:bg-gray-100">
              <Plus size={20} />
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            className="flex items-center justify-center w-full bg-orange-500 text-white py-3 px-4 rounded-lg hover:bg-orange-600 transition duration-300"
          >
            <ShoppingCart className="mr-2" size={20} />
            Add to Cart
          </button>
        </div>
      </div>

      {recommendedFoods.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedFoods.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/food/${item._id}`)}
              >
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  className="w-full h-40 object-cover"
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = "/placeholder.svg?height=160&width=300"
                  }}
                />
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default FoodDetail

