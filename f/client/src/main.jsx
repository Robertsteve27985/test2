import React from "react"
import ReactDOM from "react-dom/client"
import axios from "axios"
import { Toaster } from "react-hot-toast"
import App from "./App"
import "./index.css"

// Set base URL for API requests
axios.defaults.baseURL = "http://localhost:5000"

// Add token to requests if available
const token = localStorage.getItem("token")
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
    <Toaster position="top-center" />
  </React.StrictMode>,
)

