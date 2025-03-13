"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { ShoppingCart, User, Menu, X } from "lucide-react"

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-orange-500">
            FoodDelivery
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/" className="text-gray-700 hover:text-orange-500">
                  Menu
                </Link>
                <Link to="/checkout" className="text-gray-700 hover:text-orange-500">
                  <ShoppingCart className="inline-block" size={20} />
                </Link>
                <div className="relative group">
                  <button className="flex items-center text-gray-700 hover:text-orange-500">
                    <User className="inline-block mr-1" size={20} />
                    {user.name}
                  </button>
                  <div className="absolute right-0 w-48 mt-2 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                    <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-orange-100">
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-orange-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-orange-500">
                  Login
                </Link>
                <Link to="/signup" className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Navigation Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-3">
              <Link to="/" className="text-gray-700 hover:text-orange-500 py-2" onClick={() => setIsMenuOpen(false)}>
                Menu
              </Link>
              {user ? (
                <>
                  <Link
                    to="/checkout"
                    className="text-gray-700 hover:text-orange-500 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <ShoppingCart className="inline-block mr-2" size={20} />
                    Cart
                  </Link>
                  <Link
                    to="/profile"
                    className="text-gray-700 hover:text-orange-500 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="inline-block mr-2" size={20} />
                    Profile
                  </Link>
                  <button onClick={handleLogout} className="text-left text-gray-700 hover:text-orange-500 py-2">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-orange-500 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 inline-block"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar

