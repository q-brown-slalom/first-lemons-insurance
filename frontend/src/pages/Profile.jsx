import React, { useEffect, useState } from 'react'
import {
  Box, Typography, Paper, Grid, TextField, Button, CircularProgress,
  Alert, Divider,
} from '@mui/material'
import api from '../services/api'
import { useAuth } from '../contexts/AuthContext'

export default function Profile() {
  const { user: authUser } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({})

  useEffect(() => {
    api.get('/users/me').then(res => {
      setProfile(res.data)
      setForm(res.data)
    }).finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      const res = await api.put('/users/me', form)
      setProfile(res.data)
      setForm(res.data)
      setEditing(false)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 4000)
    } catch {
      setError('Failed to save changes.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Box display="flex" justifyContent="center" mt={6}><CircularProgress /></Box>

  return (
    <Box>
      <Typography variant="h5" gutterBottom>My Profile</Typography>

      {success && <Alert severity="success" sx={{ mb: 2 }}>Profile updated successfully.</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Personal Information</Typography>
          {!editing && (
            <Button variant="outlined" onClick={() => setEditing(true)}>Edit</Button>
          )}
        </Box>
        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="First Name"
              fullWidth
              value={editing ? form.firstName ?? '' : profile?.firstName ?? ''}
              onChange={e => setForm({ ...form, firstName: e.target.value })}
              InputProps={{ readOnly: !editing }}
              variant={editing ? 'outlined' : 'standard'}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Last Name"
              fullWidth
              value={editing ? form.lastName ?? '' : profile?.lastName ?? ''}
              onChange={e => setForm({ ...form, lastName: e.target.value })}
              InputProps={{ readOnly: !editing }}
              variant={editing ? 'outlined' : 'standard'}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Email"
              fullWidth
              value={editing ? form.email ?? '' : profile?.email ?? ''}
              onChange={e => setForm({ ...form, email: e.target.value })}
              InputProps={{ readOnly: !editing }}
              variant={editing ? 'outlined' : 'standard'}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Phone"
              fullWidth
              value={editing ? form.phone ?? '' : profile?.phone ?? ''}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              InputProps={{ readOnly: !editing }}
              variant={editing ? 'outlined' : 'standard'}
            />
          </Grid>
          {(authUser?.role === 'OWNER') && (
            <Grid item xs={12}>
              <TextField
                label="Stand Name"
                fullWidth
                value={editing ? form.standName ?? '' : profile?.standName ?? ''}
                onChange={e => setForm({ ...form, standName: e.target.value })}
                InputProps={{ readOnly: !editing }}
                variant={editing ? 'outlined' : 'standard'}
              />
            </Grid>
          )}
          <Grid item xs={12}>
            <TextField
              label="Role"
              fullWidth
              value={profile?.role ?? ''}
              InputProps={{ readOnly: true }}
              variant="standard"
            />
          </Grid>
        </Grid>

        {editing && (
          <Box display="flex" gap={2} mt={3}>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? <CircularProgress size={20} color="inherit" /> : 'Save Changes'}
            </Button>
            <Button
              variant="outlined"
              onClick={() => { setEditing(false); setForm(profile) }}
              disabled={saving}
            >
              Cancel
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  )
}
