import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Card, CardContent, TextField, Button, Typography,
  Alert, CircularProgress,
} from '@mui/material'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(username, password)
      navigate('/dashboard')
    } catch {
      setError('Invalid username or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f4f6f8',
      }}
    >
      <Card sx={{ width: 400, p: 2 }}>
        <CardContent>
          <Box textAlign="center" mb={3}>
            <Typography variant="h4" sx={{ mb: 0.5 }}>🍋</Typography>
            <Typography variant="h5" color="primary" fontWeight={700}>
              First Lemons Insurance
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Member Portal — Sign In
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <TextField
              label="Username"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              margin="normal"
              autoFocus
              required
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? <CircularProgress size={22} color="inherit" /> : 'Sign In'}
            </Button>
          </form>

          <Box mt={3} p={2} bgcolor="#f0f4f8" borderRadius={2}>
            <Typography variant="caption" color="text.secondary" display="block" fontWeight={600} mb={0.5}>
              Test Accounts
            </Typography>
            <Typography variant="caption" display="block">alice / password → Employee</Typography>
            <Typography variant="caption" display="block">bob / password → Stand Owner</Typography>
            <Typography variant="caption" display="block">carol / password → Admin</Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
