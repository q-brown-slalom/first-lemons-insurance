import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Grid, Card, CardContent, Typography, Button, Box, Chip, CircularProgress,
} from '@mui/material'
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety'
import AssignmentIcon from '@mui/icons-material/Assignment'
import ReceiptIcon from '@mui/icons-material/Receipt'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [policy, setPolicy] = useState(null)
  const [claims, setClaims] = useState([])
  const [bills, setBills] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/policy'),
      api.get('/claims'),
      api.get('/bills'),
    ]).then(([policyRes, claimsRes, billsRes]) => {
      const policyData = Array.isArray(policyRes.data) ? policyRes.data[0] : policyRes.data
      setPolicy(policyData)
      setClaims(claimsRes.data)
      setBills(billsRes.data)
    }).finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <Box display="flex" justifyContent="center" mt={6}><CircularProgress /></Box>
  }

  const openClaims = claims.filter(c => c.status === 'PENDING').length
  const outstanding = bills
    .filter(b => !b.paid)
    .reduce((sum, b) => sum + parseFloat(b.amount), 0)

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Welcome back, {user?.firstName}
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Here's a summary of your account.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <HealthAndSafetyIcon color="primary" />
                <Typography variant="subtitle2" color="text.secondary">Coverage Status</Typography>
              </Box>
              <Typography variant="h6" gutterBottom>
                {policy?.planName ?? 'No plan found'}
              </Typography>
              <Chip
                label={policy?.status ?? 'Unknown'}
                color={policy?.status === 'ACTIVE' ? 'success' : 'default'}
                size="small"
              />
              <Box mt={2}>
                <Button size="small" onClick={() => navigate('/coverage')}>View Plan Details →</Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <AssignmentIcon color="primary" />
                <Typography variant="subtitle2" color="text.secondary">Open Claims</Typography>
              </Box>
              <Typography variant="h3" fontWeight={700} color="primary">
                {openClaims}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {claims.length} total claim{claims.length !== 1 ? 's' : ''} on file
              </Typography>
              <Box mt={2}>
                <Button size="small" onClick={() => navigate('/claims')}>View All Claims →</Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <ReceiptIcon color="primary" />
                <Typography variant="subtitle2" color="text.secondary">Outstanding Balance</Typography>
              </Box>
              <Typography variant="h4" fontWeight={700} color={outstanding > 0 ? 'error' : 'success.main'}>
                ${outstanding.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {bills.filter(b => !b.paid).length} unpaid bill{bills.filter(b => !b.paid).length !== 1 ? 's' : ''}
              </Typography>
              <Box mt={2}>
                <Button size="small" onClick={() => navigate('/bills')}>View Bills →</Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
