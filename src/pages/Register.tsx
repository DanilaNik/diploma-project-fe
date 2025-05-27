import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Link,
  Alert,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';

export const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { register, isLoading, error } = useAuth();
  const navigate = useNavigate();
  
  // Синхронизируем ошибку из контекста с локальной ошибкой
  useEffect(() => {
    if (error) {
      setLocalError(error);
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setSuccessMessage(null);

    if (password !== confirmPassword) {
      setLocalError('Пароли не совпадают');
      return;
    }

    try {
      await register(email, password, name);
      setSuccessMessage('Регистрация успешно завершена! Пожалуйста, войдите в систему.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      // Ошибка уже обработана в useEffect выше
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e3f0ff 0%, #f8fbff 100%)', py: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography
            component="h1"
            variant="h4"
            sx={{ mb: 3, fontWeight: 700, color: 'primary.main', fontFamily: 'Montserrat, Arial, sans-serif' }}
          >
            Регистрация
          </Typography>

          <Box sx={{ mb: 2, textAlign: 'center' }}>
            <Button component={RouterLink} to="/" color="primary" variant="text" sx={{ fontWeight: 700, fontFamily: 'Montserrat, Arial, sans-serif' }}>
              ← На главную
            </Button>
          </Box>

          {localError && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {localError}
            </Alert>
          )}

          {successMessage && (
            <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
              {successMessage}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Имя"
              name="name"
              autoComplete="name"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={!!localError}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!localError}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Пароль"
              type="password"
              id="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!localError && localError.includes('пароль')}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Подтвердите пароль"
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={!!localError && localError.includes('пароль')}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, fontWeight: 700, fontFamily: 'Montserrat, Arial, sans-serif' }}
              disabled={isLoading}
            >
              {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
            </Button>
          </Box>

          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Уже есть аккаунт?{' '}
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate('/login')}
                sx={{ color: 'primary.main', fontWeight: 700, fontFamily: 'Montserrat, Arial, sans-serif' }}
              >
                Войти
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}; 