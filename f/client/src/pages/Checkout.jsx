"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-hot-toast"
import { Trash2 } from "lucide-react"
import { useAuth } from "../context/AuthContext"

const Checkout = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [orderNote, setOrderNote] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [processingOrder, setProcessingOrder] = useState(false)

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        setLoading(true)
        const res = await axios.get("/api/cart")
        setCartItems(res.data)
      } catch (error) {
        console.error("Error fetching cart items:", error)
        toast.error("Failed to load cart items")
      } finally {
        setLoading(false)
      }
    }

    fetchCartItems()
  }, [])

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return

    try {
      await axios.put(`/api/cart/${itemId}`, { quantity: newQuantity })
      setCartItems(cartItems.map((item) => (item._id === itemId ? { ...item, quantity: newQuantity } : item)))
    } catch (error) {
      toast.error("Failed to update quantity")
    }
  }

  const handleRemoveItem = async (itemId) => {
    try {
      await axios.delete(`/api/cart/${itemId}`)
      setCartItems(cartItems.filter((item) => item._id !== itemId))
      toast.success("Item removed from cart")
    } catch (error) {
      toast.error("Failed to remove item")
    }
  }

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.food.price * item.quantity, 0)
  }

  const calculateDeliveryFee = () => {
    const subtotal = calculateSubtotal()
    return subtotal > 50 ? 0 : 5
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateDeliveryFee()
  }

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      return toast.error("Your cart is empty")
    }

    try {
      setProcessingOrder(true)
      await axios.post("/api/orders", {
        items: cartItems.map((item) => ({
          food: item.food._id,
          quantity: item.quantity,
          price: item.food.price,
        })),
        deliveryAddress: user.address,
        paymentMethod,
        note: orderNote,
        deliveryFee: calculateDeliveryFee(),
        total: calculateTotal(),
      })

      toast.success("Order placed successfully!")
      setCartItems([])
      navigate("/")
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to place order")
    } finally {
      setProcessingOrder(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-600 mb-4">Your cart is empty</p>
            <button
              onClick={() => navigate("/")}
              className="bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition duration-300"
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subtotal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <tr key={item._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={item.food.image || "/placeholder.svg"}
                            alt={item.food.name}
                            className="h-12 w-12 object-cover rounded-md mr-3"
                            onError={(e) => {
                              e.target.onerror = null
                              e.target.src = "/placeholder.svg?height=48&width=48"
                            }}
                          />
                          <div>
                            <div className="font-medium text-gray-900">{item.food.name}</div>
                            <div className="text-sm text-gray-500">{item.food.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${item.food.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <button
                            onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                            className="p-1 border rounded hover:bg-gray-100"
                          >
                            -
                          </button>
                          <span className="px-3">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                            className="p-1 border rounded hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${(item.food.price * item.quantity).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => handleRemoveItem(item._id)} className="text-red-500 hover:text-red-700">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span>${calculateSubtotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Delivery Fee</span>
              <span>
                {calculateDeliveryFee() === 0 ? (
                  <span className="text-green-500">Free</span>
                ) : (
                  `$${calculateDeliveryFee().toFixed(2)}`
                )}
              </span>
            </div>
            <div className="border-t pt-3 flex justify-between font-bold">
              <span>Total</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="address" className="block text-gray-700 font-medium mb-2">
              Delivery Address
            </label>
            <textarea
              id="address"
              value={user?.address || ""}
              className="w-full px-4 py-2 border rounded-lg bg-gray-100"
              rows="2"
              disabled
            ></textarea>
            <p className="text-sm text-gray-500 mt-1">You can update your address in your profile</p>
          </div>

          <div className="mb-4">
            <label htmlFor="note" className="block text-gray-700 font-medium mb-2">
              Order Note (Optional)
            </label>
            <textarea
              id="note"
              value={orderNote}
              onChange={(e) => setOrderNote(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              rows="2"
              placeholder="Any special instructions..."
            ></textarea>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Payment Method</label>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="cash"
                  name="paymentMethod"
                  value="cash"
                  checked={paymentMethod === "cash"}
                  onChange={() => setPaymentMethod("cash")}
                  className="mr-2"
                />
                <label htmlFor="cash">Cash on Delivery</label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="card"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={() => setPaymentMethod("card")}
                  className="mr-2"
                />
                <label htmlFor="card">Credit/Debit Card</label>
              </div>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg hover:bg-orange-600 transition duration-300 disabled:opacity-50"
            disabled={cartItems.length === 0 || processingOrder}
          >
            {processingOrder ? "Processing..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Checkout

