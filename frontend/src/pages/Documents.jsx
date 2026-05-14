import React, { useEffect, useState } from 'react'
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Chip, IconButton, Tooltip,
  CircularProgress, Snackbar, Alert,
} from '@mui/material'
import DownloadIcon from '@mui/icons-material/Download'
import api from '../services/api'

const TYPE_COLORS = {
  POLICY: 'primary',
  EOB: 'secondary',
  OTHER: 'default',
}

export default function Documents() {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [snackbar, setSnackbar] = useState({ open: false, message: '' })

  useEffect(() => {
    api.get('/documents').then(res => setDocuments(res.data)).finally(() => setLoading(false))
  }, [])

  const handleDownload = async (doc) => {
    try {
      const res = await api.get(`/documents/${doc.id}/download`)
      setSnackbar({ open: true, message: res.data.message })
    } catch {
      setSnackbar({ open: true, message: 'Download failed.' })
    }
  }

  if (loading) return <Box display="flex" justifyContent="center" mt={6}><CircularProgress /></Box>

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Document Library</Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell>Title</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="center">Download</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {documents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                  No documents available.
                </TableCell>
              </TableRow>
            ) : (
              documents.map(doc => (
                <TableRow key={doc.id} hover>
                  <TableCell>{doc.title}</TableCell>
                  <TableCell>
                    <Chip
                      label={doc.documentType}
                      color={TYPE_COLORS[doc.documentType] ?? 'default'}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : '—'}
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Download">
                      <IconButton size="small" color="primary" onClick={() => handleDownload(doc)}>
                        <DownloadIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ open: false, message: '' })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="info" onClose={() => setSnackbar({ open: false, message: '' })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}
