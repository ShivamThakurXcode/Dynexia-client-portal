"use client"

import { createContext, useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user is logged in
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem("token")
        if (token) {
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`
          const res = await api.get("/auth/me")
          setCurrentUser(res.data.data)
        }
      } catch (err) {
        localStorage.removeItem("token")
        delete api.defaults.headers.common["Authorization"]
        setCurrentUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkLoggedIn()
  }, [])

  const register = async (userData) => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.post("/auth/register", userData)
      localStorage.setItem("token", res.data.token)
      api.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`
      const userRes = await api.get("/auth/me")
      setCurrentUser(userRes.data.data)
      navigate("/onboarding")
      return true
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed")
      return false
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials) => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.post("/auth/login", credentials)
      localStorage.setItem("token", res.data.token)
      api.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`
      const userRes = await api.get("/auth/me")
      setCurrentUser(userRes.data.data)
      navigate("/dashboard")
      return true
    } catch (err) {
      setError(err.response?.data?.error || "Login failed")
      return false
    } finally {
      setLoading(false)
    }
  }

  const googleAuth = async (token) => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.post("/auth/google", { token })
      localStorage.setItem("token", res.data.token)
      api.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`
      const userRes = await api.get("/auth/me")
      setCurrentUser(userRes.data.data)
      navigate("/dashboard")
      return true
    } catch (err) {
      setError(err.response?.data?.error || "Google authentication failed")
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await api.get("/auth/logout")
    } catch (err) {
      console.error("Logout error:", err)
    } finally {
      localStorage.removeItem("token")
      delete api.defaults.headers.common["Authorization"]
      setCurrentUser(null)
      navigate("/")
    }
  }

  const updateProfile = async (userData) => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.put("/auth/updatedetails", userData)
      setCurrentUser(res.data.data)
      return true
    } catch (err) {
      setError(err.response?.data?.error || "Profile update failed")
      return false
    } finally {
      setLoading(false)
    }
  }

  const updatePassword = async (passwordData) => {
    setLoading(true)
    setError(null)
    try {
      await api.put("/auth/updatepassword", passwordData)
      return true
    } catch (err) {
      setError(err.response?.data?.error || "Password update failed")
      return false
    } finally {
      setLoading(false)
    }
  }

  const value = {
    currentUser,
    loading,
    error,
    register,
    login,
    googleAuth,
    logout,
    updateProfile,
    updatePassword,
    setError,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)

export default AuthContext
