import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Button, Box, IconButton, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { useAuth } from './contexts/AuthContext';
import { Home } from './pages/Home';
import Summarize from './pages/Summarize';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import Dashboard from './pages/Dashboard';
import { PrivateRoute } from './components/PrivateRoute';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import HistoryIcon from '@mui/icons-material/History';
import SummarizeIcon from '@mui/icons-material/Summarize';
import SummaryResultPage from './pages/SummaryResultPage';

const AppRoutes: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isSummarizePage = location.pathname === '/summarize';
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const menuItems = [
    {
      text: 'Суммаризация',
      icon: <SummarizeIcon color="primary" />,
      to: '/summarize',
      show: !isSummarizePage,
    },
    {
      text: 'История',
      icon: <HistoryIcon color="primary" />,
      to: '/dashboard',
      show: isAuthenticated && location.pathname !== '/dashboard',
    },
  ];

  return (
    <>
      {!isAuthPage && (
        <AppBar
          position="fixed"
          color="transparent"
          elevation={0}
          sx={{
            background: drawerOpen ? 'transparent' : 'rgba(255,255,255,0.95)',
            boxShadow: drawerOpen ? 'none' : undefined,
            zIndex: 1201,
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            {/* Desktop navbar */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
              <Button component={Link} to="/" color="primary" sx={{ p: 0, minWidth: 0, textTransform: 'none' }}>
                <Box sx={{ width: 36, height: 36, mr: 1 }}>
                  <svg width="36" height="36" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                    <rect width="32" height="192" x="16" y="160" fill="#1976d2" />
                    <rect width="32" height="192" x="376" y="160" fill="#1976d2" />
                    <rect width="32" height="328" x="104" y="88" fill="#64b5f6" />
                    <rect width="32" height="320" x="288" y="96" fill="#1976d2" />
                    <rect width="32" height="320" x="464" y="96" fill="#64b5f6" />
                    <rect width="32" height="480" x="192" y="16" fill="#1976d2" />
                  </svg>
                </Box>
                <span style={{ fontWeight: 700, color: '#1976d2', fontFamily: 'Montserrat, Arial, sans-serif', fontSize: 28, letterSpacing: -1 }}>Echo</span>
              </Button>
            </Box>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
              {menuItems.map((item) => item.show && (
                <Button key={item.text} component={Link} to={item.to} color="primary" sx={{ fontWeight: 700, fontFamily: 'Montserrat, Arial, sans-serif' }}>{item.text}</Button>
              ))}
              {isAuthenticated && (
                <Button color="error" onClick={logout}>Выйти</Button>
              )}
              {!isAuthenticated && !isAuthPage && (
                <Button component={Link} to="/login" color="primary" startIcon={<AccountCircle />} sx={{ fontWeight: 700, fontFamily: 'Montserrat, Arial, sans-serif' }}>Войти</Button>
              )}
            </Box>
            {/* Mobile navbar */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
              <Button component={Link} to="/" color="primary" sx={{ p: 0, minWidth: 0, textTransform: 'none', display: 'flex', alignItems: 'center' }}>
                <Box sx={{ width: 32, height: 32, mr: 1 }}>
                  <svg width="32" height="32" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                    <rect width="32" height="192" x="16" y="160" fill="#1976d2" />
                    <rect width="32" height="192" x="376" y="160" fill="#1976d2" />
                    <rect width="32" height="328" x="104" y="88" fill="#64b5f6" />
                    <rect width="32" height="320" x="288" y="96" fill="#1976d2" />
                    <rect width="32" height="320" x="464" y="96" fill="#64b5f6" />
                    <rect width="32" height="480" x="192" y="16" fill="#1976d2" />
                  </svg>
                </Box>
                <span style={{ fontWeight: 700, color: '#1976d2', fontFamily: 'Montserrat, Arial, sans-serif', fontSize: 22, letterSpacing: -1 }}>Echo</span>
              </Button>
              <IconButton edge="end" color="primary" aria-label="menu" onClick={() => setDrawerOpen(true)}>
                <MenuIcon fontSize="large" />
              </IconButton>
            </Box>
            <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
              <Box sx={{ width: 260, pt: 2 }} role="presentation" onClick={() => setDrawerOpen(false)}>
                <List>
                  <ListItem>
                    <ListItemText
                      primary={<span style={{ fontWeight: 700, color: '#1976d2', fontFamily: 'Montserrat, Arial, sans-serif', fontSize: 22, letterSpacing: -1 }}>Echo</span>}
                    />
                  </ListItem>
                  <Divider />
                  {menuItems.map((item) => item.show && (
                    <ListItem key={item.text} disablePadding>
                      <ListItemButton component={Link} to={item.to}>
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: 700, fontFamily: 'Montserrat, Arial, sans-serif' }} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                  <Divider sx={{ my: 1 }} />
                  {isAuthenticated && (
                    <ListItem disablePadding>
                      <ListItemButton onClick={logout}>
                        <ListItemText primary="Выйти" primaryTypographyProps={{ fontWeight: 700, color: '#d32f2f', fontFamily: 'Montserrat, Arial, sans-serif' }} />
                      </ListItemButton>
                    </ListItem>
                  )}
                  {!isAuthenticated && !isAuthPage && (
                    <ListItem disablePadding>
                      <ListItemButton component={Link} to="/login">
                        <ListItemIcon><AccountCircle color="primary" /></ListItemIcon>
                        <ListItemText primary="Войти" primaryTypographyProps={{ fontWeight: 700, fontFamily: 'Montserrat, Arial, sans-serif' }} />
                      </ListItemButton>
                    </ListItem>
                  )}
                </List>
              </Box>
            </Drawer>
          </Toolbar>
        </AppBar>
      )}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/summarize" element={<Summarize />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/summary/:id" element={<SummaryResultPage />} />
      </Routes>
    </>
  );
};

export default AppRoutes; 