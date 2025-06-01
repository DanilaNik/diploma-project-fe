import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [girlImage, setGirlImage] = useState('/echo-girl.png');

  useEffect(() => {
    const checkWebpSupport = () => {
      try {
        return document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0;
      } catch (err) {
        return false;
      }
    };
    if (checkWebpSupport()) {
      setGirlImage('/echo-girl.webp');
    } else {
      setGirlImage('/echo-girl.png');
    }
  }, []);

  const handleGetStarted = () => {
    navigate('/summarize');
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        position: 'relative',
        background: "url('/echo-bg.jpg') center top/cover no-repeat, linear-gradient(135deg, #e3f0ff 0%, #f8fbff 100%)",
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      {/* Контент */}
      <Box sx={{ pt: { xs: 12, md: 18 }, pb: 0, zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ width: 110, height: 110, mr: 3 }}>
            <svg width="110" height="110" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="192" x="16" y="160" fill="#1976d2" />
              <rect width="32" height="192" x="376" y="160" fill="#1976d2" />
              <rect width="32" height="328" x="104" y="88" fill="#64b5f6" />
              <rect width="32" height="320" x="288" y="96" fill="#1976d2" />
              <rect width="32" height="320" x="464" y="96" fill="#64b5f6" />
              <rect width="32" height="480" x="192" y="16" fill="#1976d2" />
            </svg>
          </Box>
          <Typography variant="h2" sx={{ fontFamily: 'Montserrat', fontWeight: 600, color: '#1976d2', letterSpacing: -1, fontSize: { xs: 72, md: 120 }, lineHeight: 1.05 }}>
            Echo
          </Typography>
        </Box>
        <Typography variant="h5" sx={{ mb: 2, color: '#222', fontWeight: 400, textAlign: 'center', fontFamily: 'Inter, Arial, sans-serif', fontSize: { xs: 22, md: 28 }, letterSpacing: 0.2, lineHeight: 1.2 }}>
          Summarize. Analyze. Understand
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, color: '#888', textAlign: 'center', maxWidth: 420, fontFamily: 'Inter, Arial, sans-serif', fontWeight: 400, fontSize: { xs: 15, md: 17 }, lineHeight: 1.5 }}>
          Быстро получайте краткое содержание и транскрипцию ваших аудио и видео файлов. Просто загрузите файл и Echo всё сделает за вас
        </Typography>
        <Button
          variant="contained"
          size="large"
          color="primary"
          onClick={handleGetStarted}
          sx={{ px: 5, py: 1.5, fontWeight: 700, fontSize: 20, borderRadius: 3, boxShadow: '0 2px 8px rgba(30,60,120,0.10)', fontFamily: 'Montserrat, Poppins, Arial, sans-serif', letterSpacing: 0.5 }}
        >
          Начать
        </Button>
      </Box>
      {/* Картинка девушки строго внизу */}
      <Box
        sx={{
          width: '100vw',
          aspectRatio: '1892/514',
          background: `url('${girlImage}') center bottom/contain no-repeat`,
          flexShrink: 0,
          position: 'relative',
          display: { xs: 'none', md: 'block' },
        }}
      />
    </Box>
  );
}; 