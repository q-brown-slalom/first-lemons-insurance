import React, { useEffect, useState } from 'react'
import {
  Box, Typography, Paper, Grid, Chip, CircularProgress, Divider,
} from '@mui/material'
import api from '../services/api'

function InfoRow({ label, value }) {
  return (
    <Box display="flex" justifyContent="space-between" py={1.5}>
      <Typography variant="body2" color="text.secondary">{label}</Typography>
      <Typography variant="body2" fontWeight={500}>{value}</Typography>
    </Box>
  )
}

export default function Coverage() {
  const [policy, setPolicy] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/policy')
      .then(res => {
        const data = Array.isArray(res.data) ? res.data[0] : res.data
        setPolicy(data)
      })
      .catch(() => setError('Could not load policy.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Box display="flex" justifyContent="center" mt={6}><CircularProgress /></Box>
  if (error) return <Typography color="error">{error}</Typography>
  if (!policy) return <Typography>No policy found.</Typography>

  return (
    <Box>
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <Typography variant="h5">My Coverage</Typography>
        <Chip
          label={policy.status}
          color={policy.status === 'ACTIVE' ? 'success' : 'default'}
          size="small"
        />
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Plan Details</Typography>
            <Divider sx={{ mb: 1 }} />
            <InfoRow label="Plan Name" value={policy.planName} />
            <InfoRow label="Status" value={policy.status} />
            <InfoRow label="Effective Date" value={policy.effectiveDate} />
            <InfoRow label="Expiration Date" value={policy.expirationDate} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Cost Sharing</Typography>
            <Divider sx={{ mb: 1 }} />
            <InfoRow label="Annual Deductible" value={`$${parseFloat(policy.deductible).toFixed(2)}`} />
            <InfoRow label="Out-of-Pocket Maximum" value={`$${parseFloat(policy.outOfPocketMax).toFixed(2)}`} />
            <InfoRow label="Coinsurance" value={`${policy.coinsurancePercent}% after deductible`} />
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>What's Covered</Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={1}>
              {[
                'Preventive Care (100%)',
                'Emergency Services',
                'Hospitalization',
                'Outpatient Services',
                'Prescription Drugs',
                'Mental Health Services',
                'Occupational Health',
                'Equipment Repair (Owners)',
                'Supply Reimbursement (Owners)',
                'Health Inspection Fees (Owners)',
              ].map(item => (
                <Grid item xs={12} sm={6} key={item}>
                  <Box display="flex" alignItems="center" gap={1} py={0.5}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main' }} />
                    <Typography variant="body2">{item}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}
