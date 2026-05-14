import React, { useEffect, useState } from 'react'
import {
  Box, Typography, Tabs, Tab, Grid, Card, CardContent, Chip,
  CircularProgress,
} from '@mui/material'
import PhoneIcon from '@mui/icons-material/Phone'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'

function ProviderCard({ provider }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
          <Typography variant="h6" sx={{ fontSize: 16, fontWeight: 600 }}>
            {provider.name}
          </Typography>
          <Chip
            label={provider.acceptingNew ? 'Accepting' : 'Full'}
            color={provider.acceptingNew ? 'success' : 'default'}
            size="small"
          />
        </Box>
        <Typography variant="body2" color="primary" gutterBottom>
          {provider.specialty}
        </Typography>
        <Box display="flex" alignItems="flex-start" gap={0.5} mt={1}>
          <LocationOnIcon sx={{ fontSize: 16, color: 'text.secondary', mt: 0.2 }} />
          <Typography variant="body2" color="text.secondary">{provider.address}</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={0.5} mt={0.5}>
          <PhoneIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">{provider.phone}</Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

export default function Providers() {
  const { user } = useAuth()
  const [tab, setTab] = useState(0)
  const [medical, setMedical] = useState([])
  const [standService, setStandService] = useState([])
  const [loading, setLoading] = useState(true)

  const isOwnerOrAdmin = user?.role === 'OWNER' || user?.role === 'ADMIN'

  useEffect(() => {
    const requests = [api.get('/providers?type=MEDICAL')]
    if (isOwnerOrAdmin) requests.push(api.get('/providers?type=STAND_SERVICE'))

    Promise.all(requests).then(([medRes, standRes]) => {
      setMedical(medRes.data)
      if (standRes) setStandService(standRes.data)
    }).finally(() => setLoading(false))
  }, [isOwnerOrAdmin])

  if (loading) return <Box display="flex" justifyContent="center" mt={6}><CircularProgress /></Box>

  const currentProviders = tab === 0 ? medical : standService

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Find Providers</Typography>

      {isOwnerOrAdmin ? (
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
          <Tab label="Medical Providers" />
          <Tab label="Stand Service Providers" />
        </Tabs>
      ) : (
        <Typography variant="body2" color="text.secondary" mb={3}>
          In-network medical providers in your area.
        </Typography>
      )}

      <Grid container spacing={2}>
        {currentProviders.map(p => (
          <Grid item xs={12} sm={6} md={4} key={p.id}>
            <ProviderCard provider={p} />
          </Grid>
        ))}
        {currentProviders.length === 0 && (
          <Grid item xs={12}>
            <Typography color="text.secondary" textAlign="center" mt={4}>
              No providers found.
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  )
}
