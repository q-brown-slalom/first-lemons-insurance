import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Toolbar, Typography, Box, Divider,
} from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety'
import AssignmentIcon from '@mui/icons-material/Assignment'
import ReceiptIcon from '@mui/icons-material/Receipt'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'
import FolderIcon from '@mui/icons-material/Folder'
import PersonIcon from '@mui/icons-material/Person'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import { useAuth } from '../contexts/AuthContext'

const DRAWER_WIDTH = 240

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon />, roles: ['EMPLOYEE', 'OWNER', 'ADMIN'] },
  { label: 'My Coverage', path: '/coverage', icon: <HealthAndSafetyIcon />, roles: ['EMPLOYEE', 'OWNER', 'ADMIN'] },
  { label: 'Claims', path: '/claims', icon: <AssignmentIcon />, roles: ['EMPLOYEE', 'OWNER', 'ADMIN'] },
  { label: 'Bills', path: '/bills', icon: <ReceiptIcon />, roles: ['EMPLOYEE', 'OWNER', 'ADMIN'] },
  { label: 'Find Providers', path: '/providers', icon: <LocalHospitalIcon />, roles: ['EMPLOYEE', 'OWNER', 'ADMIN'] },
  { label: 'Documents', path: '/documents', icon: <FolderIcon />, roles: ['EMPLOYEE', 'OWNER', 'ADMIN'] },
  { label: 'Profile', path: '/profile', icon: <PersonIcon />, roles: ['EMPLOYEE', 'OWNER', 'ADMIN'] },
  { label: 'Manage Users', path: '/admin/users', icon: <AdminPanelSettingsIcon />, roles: ['ADMIN'] },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()

  const visible = navItems.filter(item => item.roles.includes(user?.role))

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          backgroundColor: '#1a5276',
          color: '#fff',
        },
      }}
    >
      <Toolbar sx={{ flexDirection: 'column', alignItems: 'flex-start', py: 2 }}>
        <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700 }}>
          🍋 First Lemons
        </Typography>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
          Insurance Portal
        </Typography>
      </Toolbar>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.15)' }} />
      <Box sx={{ px: 1, py: 1 }}>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', px: 1, textTransform: 'uppercase', letterSpacing: 1 }}>
          {user?.role}
        </Typography>
      </Box>
      <List dense>
        {visible.map(item => {
          const active = location.pathname === item.path
          return (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                onClick={() => navigate(item.path)}
                sx={{
                  mx: 1, borderRadius: 2, mb: 0.5,
                  backgroundColor: active ? 'rgba(255,255,255,0.15)' : 'transparent',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
                }}
              >
                <ListItemIcon sx={{ color: '#fff', minWidth: 36 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: 14 }} />
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>
    </Drawer>
  )
}
