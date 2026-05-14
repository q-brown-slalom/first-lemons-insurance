import React, { useEffect, useState } from 'react'
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Chip, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, MenuItem, CircularProgress, Alert,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import api from '../services/api'

const STATUS_COLORS = {
  APPROVED: 'success',
  PENDING: 'warning',
  DENIED: 'error',
}

const CLAIM_TYPES = ['MEDICAL', 'EQUIPMENT', 'INSPECTION', 'SUPPLY']

export default function Claims() {
  const [claims, setClaims] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [form, setForm] = useState({
    description: '',
    claimType: 'MEDICAL',
    dateOfService: '',
    amount: '',
  })

  const fetchClaims = () => {
    api.get('/claims').then(res => setClaims(res.data)).finally(() => setLoading(false))
  }

  useEffect(() => { fetchClaims() }, [])

  const handleSubmit = async () => {
    setSubmitting(true)
    setSubmitError('')
    try {
      await api.post('/claims', {
        ...form,
        amount: parseFloat(form.amount),
      })
      setDialogOpen(false)
      setForm({ description: '', claimType: 'MEDICAL', dateOfService: '', amount: '' })
      fetchClaims()
    } catch {
      setSubmitError('Failed to submit claim. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <Box display="flex" justifyContent="center" mt={6}><CircularProgress /></Box>

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Claims</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}>
          Submit Claim
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell>Date of Service</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Type</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="center">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {claims.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                  No claims on file.
                </TableCell>
              </TableRow>
            ) : (
              claims.map(claim => (
                <TableRow key={claim.id} hover>
                  <TableCell>{claim.dateOfService}</TableCell>
                  <TableCell>{claim.description}</TableCell>
                  <TableCell>
                    <Chip label={claim.claimType} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell align="right">${parseFloat(claim.amount).toFixed(2)}</TableCell>
                  <TableCell align="center">
                    <Chip
                      label={claim.status}
                      color={STATUS_COLORS[claim.status] ?? 'default'}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Submit a New Claim</DialogTitle>
        <DialogContent>
          {submitError && <Alert severity="error" sx={{ mb: 2 }}>{submitError}</Alert>}
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            margin="normal"
          />
          <TextField
            select
            label="Claim Type"
            fullWidth
            value={form.claimType}
            onChange={e => setForm({ ...form, claimType: e.target.value })}
            margin="normal"
          >
            {CLAIM_TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
          </TextField>
          <TextField
            label="Date of Service"
            type="date"
            fullWidth
            value={form.dateOfService}
            onChange={e => setForm({ ...form, dateOfService: e.target.value })}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Amount ($)"
            type="number"
            fullWidth
            value={form.amount}
            onChange={e => setForm({ ...form, amount: e.target.value })}
            margin="normal"
            inputProps={{ min: 0, step: '0.01' }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={submitting || !form.description || !form.dateOfService || !form.amount}
          >
            {submitting ? <CircularProgress size={20} color="inherit" /> : 'Submit Claim'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
