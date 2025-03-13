"use client"

import { createContext, useState, useEffect, useContext } from "react"
import axios from "axios"

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem("token")
        if (token) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
          const res = await axios.get("/api/users/me")
          setUser(res.data)
        }
      } catch (error) {
        localStorage.removeItem("token")
        delete axios.defaults.headers.common["Authorization"]
      } finally {
        setLoading(false)
      }
    }

    checkLoggedIn()
  }, [])

  const login = async (email, password) => {
    const res = await axios.post("/api/auth/login", { email, password })
    localStorage.setItem("token", res.data.token)
    axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`
    setUser(res.data.user)
    return res.data
  }

  const signup = async (userData) => {
    const res = await axios.post("/api/auth/signup", userData)
    localStorage.setItem("token", res.data.token)
    axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`
    setUser(res.data.user)
    return res.data
  }

  const logout = () => {
    localStorage.removeItem("token")
    delete axios.defaults.headers.common["Authorization"]
    setUser(null)
  }

  const updateProfile = async (userData) => {
    const res = await axios.put("/api/users/profile", userData)
    setUser(res.data)
    return res.data
  }

  const forgotPassword = async (email) => {
    const res = await axios.post("/api/auth/forgot-password", { email })
    return res.data
  }

  const resetPassword = async (otp, password) => {
    const res = await axios.post("/api/auth/reset-password", { otp, password })
    return res.data
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        updateProfile,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

