import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider, CssBaseline } from '@mui/material'
import theme from './theme'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Coverage from './pages/Coverage'
import Claims from './pages/Claims'
import Bills from './pages/Bills'
import Providers from './pages/Providers'
import Documents from './pages/Documents'
import Profile from './pages/Profile'
import AdminUsers from './pages/AdminUsers'

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="coverage" element={<Coverage />} />
              <Route path="claims" element={<Claims />} />
              <Route path="bills" element={<Bills />} />
              <Route path="providers" element={<Providers />} />
              <Route path="documents" element={<Documents />} />
              <Route path="profile" element={<Profile />} />
              <Route path="admin/users" element={<AdminUsers />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}
