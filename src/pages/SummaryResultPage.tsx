import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { summarizationService } from '../services/api';
import { Box, Paper, Typography, CircularProgress, Container, Button, TextField, Snackbar, Alert } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import { useAuth } from '../contexts/AuthContext';

const SummaryResultPage: React.FC = () => {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedSummary, setEditedSummary] = useState('');
  const [savingStatus, setSavingStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await summarizationService.getRequestById(Number(id));
        setData(result);
        setEditedSummary(result.summary);
      } catch (err) {
        setError('Ошибка при загрузке результата');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSummaryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedSummary(e.target.value);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    if (!data || !id) return;

    setSavingStatus('saving');
    try {
      await summarizationService.updateSummary(Number(id), editedSummary);
      setData({ ...data, summary: editedSummary });
      setSavingStatus('success');
      setIsEditing(false);
      setTimeout(() => setSavingStatus('idle'), 3000);
    } catch (err) {
      console.error('Error updating summary:', err);
      setSavingStatus('error');
    }
  };

  const handleDownload = () => {
    if (!data) return;
    
    const text = `Транскрипция:\n${data.transcript}\n\nКраткое содержание:\n${data.summary}`;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${data.filename.split('.')[0]}_summary.txt`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  };

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
          <Paper elevation={2} sx={{ p: 3, mb: 3, background: '#f8f9fa', borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 600 }}>
                Краткое содержание
              </Typography>
              {isAuthenticated && (
                <Button 
                  startIcon={<EditIcon />} 
                  onClick={handleEditToggle}
                  variant={isEditing ? "contained" : "outlined"}
                  size="small"
                >
                  {isEditing ? "Отменить" : "Редактировать"}
                </Button>
              )}
            </Box>
            {isEditing ? (
              <TextField
                fullWidth
                multiline
                rows={8}
                value={editedSummary}
                onChange={handleSummaryChange}
                variant="outlined"
                sx={{ mb: 2, background: '#fff' }}
              />
            ) : (
              <Box sx={{ maxHeight: 320, overflowY: 'auto', background: '#fff', borderRadius: 2, p: 2, border: '1px solid #e3e3e3', mb: 2 }}>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', color: '#2c3e50', fontSize: '1.05rem', lineHeight: 1.7 }}>
                  {data.summary}
                </Typography>
              </Box>
            )}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              {isAuthenticated && isEditing && (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                  disabled={savingStatus === 'saving'}
                >
                  {savingStatus === 'saving' ? 'Сохранение...' : 'Сохранить'}
                </Button>
              )}
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={handleDownload}
              >
                Скачать
              </Button>
            </Box>
          </Paper>
        </Paper>

        <Snackbar
          open={savingStatus === 'success'}
          autoHideDuration={3000}
          onClose={() => setSavingStatus('idle')}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity="success">Суммаризация успешно обновлена</Alert>
        </Snackbar>

        <Snackbar
          open={savingStatus === 'error'}
          autoHideDuration={3000}
          onClose={() => setSavingStatus('idle')}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity="error">Ошибка при обновлении суммаризации</Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default SummaryResultPage; 