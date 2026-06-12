import React, { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem('fl_token')
    const storedUser = localStorage.getItem('fl_user')
    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (username, password) => {
    const response = await api.post('/auth/login', { username, password })
    const { token, role, userId, firstName, lastName } = response.data
    const userData = { userId, role, firstName, lastName, username }
    localStorage.setItem('fl_token', token)
    localStorage.setItem('fl_user', JSON.stringify(userData))
    setToken(token)
    setUser(userData)
    return userData
  }

  const logout = () => {
    localStorage.removeItem('fl_token')
    localStorage.removeItem('fl_user')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
