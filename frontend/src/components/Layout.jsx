import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import {
  Box, AppBar, Toolbar, Typography, IconButton, Avatar, Menu,
  MenuItem, Tooltip,
} from '@mui/material'
import Sidebar from './Sidebar'
import { useAuth } from '../contexts/AuthContext'

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = React.useState(null)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const initials = user
    ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase()
    : '?'

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f4f6f8' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <AppBar
          position="static"
          elevation={0}
          sx={{ backgroundColor: '#fff', borderBottom: '1px solid #e0e0e0' }}
        >
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1, color: '#1a5276', fontWeight: 600 }}>
              Member Portal
            </Typography>
            <Typography variant="body2" sx={{ color: '#555', mr: 2 }}>
              {user?.firstName} {user?.lastName}
            </Typography>
            <Tooltip title="Account">
              <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} size="small">
                <Avatar sx={{ bgcolor: '#1a5276', width: 34, height: 34, fontSize: 14 }}>
                  {initials}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
            >
              <MenuItem onClick={() => { setAnchorEl(null); navigate('/profile') }}>
                My Profile
              </MenuItem>
              <MenuItem onClick={handleLogout}>Sign Out</MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}
