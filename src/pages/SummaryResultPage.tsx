import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { summarizationService } from '../services/api';
import { Box, Paper, Typography, CircularProgress, Container } from '@mui/material';

const SummaryResultPage: React.FC = () => {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await summarizationService.getRequestById(Number(id));
        setData(result);
      } catch (err) {
        setError('Ошибка при загрузке результата');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(135deg, #e3f0ff 0%, #f8fbff 100%)' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !data) {
    return (
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e3f0ff 0%, #f8fbff 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Container maxWidth="md">
          <Paper elevation={3} sx={{ p: 4, borderRadius: 4, textAlign: 'center' }}>
            <Typography variant="h5" color="error">
              {error || 'Результаты не найдены'}
            </Typography>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e3f0ff 0%, #f8fbff 100%)', py: 8, display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
      <Container maxWidth="md">
        <Paper elevation={4} sx={{ p: 4, borderRadius: 4, background: 'rgba(255,255,255,0.97)', mx: 'auto', maxWidth: 700, mt: 8 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#1976d2', fontWeight: 600 }}>
              Файл: {data.filename}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Дата: {new Date(data.created_at).toLocaleString('ru-RU')}
            </Typography>
          </Box>
          <Paper elevation={2} sx={{ p: 3, mb: 3, background: '#f8f9fa', borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#1976d2', fontWeight: 600 }}>
              Транскрипция
            </Typography>
            <Box sx={{ maxHeight: 320, overflowY: 'auto', background: '#fff', borderRadius: 2, p: 2, border: '1px solid #e3e3e3' }}>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', color: '#2c3e50', fontSize: '1.05rem', lineHeight: 1.7 }}>
                {data.transcript}
              </Typography>
            </Box>
          </Paper>
          <Paper elevation={2} sx={{ p: 3, background: '#f8f9fa', borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#1976d2', fontWeight: 600 }}>
              Краткое содержание
            </Typography>
            <Box sx={{ maxHeight: 320, overflowY: 'auto', background: '#fff', borderRadius: 2, p: 2, border: '1px solid #e3e3e3' }}>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', color: '#2c3e50', fontSize: '1.05rem', lineHeight: 1.7 }}>
                {data.summary}
              </Typography>
            </Box>
          </Paper>
        </Paper>
      </Container>
    </Box>
  );
};

export default SummaryResultPage; 