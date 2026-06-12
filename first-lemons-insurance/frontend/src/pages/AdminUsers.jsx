import React, { useEffect, useState } from 'react'
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Chip, CircularProgress,
} from '@mui/material'
import api from '../services/api'

const ROLE_COLORS = { EMPLOYEE: 'default', OWNER: 'primary', ADMIN: 'secondary' }

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/users').then(res => setUsers(res.data)).finally(() => setLoading(false))
  }, [])

  if (loading) return <Box display="flex" justifyContent="center" mt={6}><CircularProgress /></Box>

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Manage Users</Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        All portal members across all lemonade stands.
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell>Name</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Stand Name</TableCell>
              <TableCell align="center">Role</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(u => (
              <TableRow key={u.id} hover>
                <TableCell>{u.firstName} {u.lastName}</TableCell>
                <TableCell>{u.username}</TableCell>
                <TableCell>{u.email ?? '—'}</TableCell>
                <TableCell>{u.phone ?? '—'}</TableCell>
                <TableCell>{u.standName ?? '—'}</TableCell>
                <TableCell align="center">
                  <Chip
                    label={u.role}
                    color={ROLE_COLORS[u.role] ?? 'default'}
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
