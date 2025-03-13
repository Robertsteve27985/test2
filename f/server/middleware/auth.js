import jwt from "jsonwebtoken"

export const auth = (req, res, next) => {
  try {
    // Get token from header
    const token = req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" })
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "4ff1dc747d4ac920e1e859a4b69e232d2f3d9976664144cd6eb509f20fd37036",
    )

    // Add user from payload
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" })
  }
}

