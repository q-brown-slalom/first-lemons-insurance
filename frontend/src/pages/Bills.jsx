import React, { useEffect, useState } from 'react'
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Chip, Button, CircularProgress, Alert,
} from '@mui/material'
import api from '../services/api'

export default function Bills() {
  const [bills, setBills] = useState([])
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState(null)
  const [successMsg, setSuccessMsg] = useState('')

  const fetchBills = () => {
    api.get('/bills').then(res => setBills(res.data)).finally(() => setLoading(false))
  }

  useEffect(() => { fetchBills() }, [])

  const handlePay = async (id) => {
    setPaying(id)
    try {
      await api.post(`/bills/${id}/pay`)
      setSuccessMsg('Payment processed successfully.')
      fetchBills()
      setTimeout(() => setSuccessMsg(''), 4000)
    } finally {
      setPaying(null)
    }
  }

  if (loading) return <Box display="flex" justifyContent="center" mt={6}><CircularProgress /></Box>

  const outstanding = bills.filter(b => !b.paid).reduce((sum, b) => sum + parseFloat(b.amount), 0)

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Bills</Typography>
        <Box textAlign="right">
          <Typography variant="caption" color="text.secondary">Outstanding Balance</Typography>
          <Typography variant="h5" color={outstanding > 0 ? 'error' : 'success.main'} fontWeight={700}>
            ${outstanding.toFixed(2)}
          </Typography>
        </Box>
      </Box>

      {successMsg && <Alert severity="success" sx={{ mb: 2 }}>{successMsg}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell>Description</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bills.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                  No bills on file.
                </TableCell>
              </TableRow>
            ) : (
              bills.map(bill => (
                <TableRow key={bill.id} hover>
                  <TableCell>{bill.description}</TableCell>
                  <TableCell align="right">${parseFloat(bill.amount).toFixed(2)}</TableCell>
                  <TableCell>{bill.dueDate}</TableCell>
                  <TableCell align="center">
                    <Chip
                      label={bill.paid ? 'Paid' : 'Unpaid'}
                      color={bill.paid ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    {!bill.paid && (
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => handlePay(bill.id)}
                        disabled={paying === bill.id}
                      >
                        {paying === bill.id ? <CircularProgress size={16} color="inherit" /> : 'Pay Now'}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
