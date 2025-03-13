import express from "express"
import jwt from "jsonwebtoken"
import User from "../models/User.js"
import { sendEmail } from "../utils/email.js"

const router = express.Router()

// Register a new user
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, address } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" })
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      address,
    })

    await user.save()

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET || "4ff1dc747d4ac920e1e859a4b69e232d2f3d9976664144cd6eb509f20fd37036",
      { expiresIn: "7d" },
    )

    // Return user data and token
    res.status(201).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        address: user.address,
      },
    })
  } catch (error) {
    console.error("Signup error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" })
    }

    // Check password
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" })
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET || "4ff1dc747d4ac920e1e859a4b69e232d2f3d9976664144cd6eb509f20fd37036",
      { expiresIn: "7d" },
    )

    // Return user data and token
    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        address: user.address,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Forgot password - send OTP
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body

    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    // Set OTP and expiry
    user.resetPasswordOtp = otp
    user.resetPasswordExpires = Date.now() + 3600000 // 1 hour
    await user.save()

    // Send email with OTP
    const emailSent = await sendEmail(
      email,
      "Password Reset OTP",
      `Your OTP for password reset is: ${otp}. It will expire in 1 hour.`,
    )

    if (!emailSent) {
      return res.status(500).json({ message: "Failed to send OTP email" })
    }

    res.json({ message: "OTP sent to your email" })
  } catch (error) {
    console.error("Forgot password error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Reset password with OTP
router.post("/reset-password", async (req, res) => {
  try {
    const { otp, password } = req.body

    // Find user by OTP
    const user = await User.findOne({
      resetPasswordOtp: otp,
      resetPasswordExpires: { $gt: Date.now() },
    })

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP" })
    }

    // Update password
    user.password = password
    user.resetPasswordOtp = null
    user.resetPasswordExpires = null
    await user.save()

    res.json({ message: "Password reset successful" })
  } catch (error) {
    console.error("Reset password error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

export default router

