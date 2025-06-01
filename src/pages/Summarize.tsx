import React, { useState, useEffect } from 'react';
import { Box, Container, Paper, Slide, Typography, Snackbar, Alert, Button } from '@mui/material';
import FileUpload from '../components/FileUpload';
import { SummaryView } from '../components/SummaryView';
import { useAuth } from '../contexts/AuthContext';
import { summarizationService } from '../services/api';

const Summarize: React.FC = () => {
  const [summary, setSummary] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  const [status, setStatus] = useState('idle');
  const [savingStatus, setSavingStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  useEffect(() => {
    localStorage.removeItem('summaryData');
    localStorage.removeItem('summaryStatus');
    setSummary(null);
    setStatus('idle');
  }, []);

  useEffect(() => {
    if (summary) {
      localStorage.setItem('summaryData', JSON.stringify(summary));
    }
    localStorage.setItem('summaryStatus', status);
  }, [summary, status]);

  const handleSuccess = (result: any) => {
    setSummary(result);
    setError(null);
    setStatus('done');
    localStorage.setItem('summaryData', JSON.stringify(result));
    localStorage.setItem('summaryStatus', 'done');
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setSummary(null);
    setStatus('error');
    localStorage.setItem('summaryStatus', 'error');
  };

  const handleSummaryChange = (newSummary: string) => {
    if (summary) {
      setSummary({ ...summary, summary: newSummary });
    }
  };

  const handleSave = async () => {
    if (!summary || !summary.id) {
      setError('Невозможно обновить суммаризацию: отсутствуют данные');
      return;
    }

    setSavingStatus('saving');
    try {
      await summarizationService.updateSummary(summary.id, summary.summary);
      setSavingStatus('success');
      setTimeout(() => setSavingStatus('idle'), 3000);
    } catch (err: any) {
      console.error('Error updating summary:', err);
      setError(err?.message || 'Произошла ошибка при обновлении суммаризации');
      setSavingStatus('error');
    }
  };

  const handleDownload = () => {
    console.log('Download button clicked');
    console.log('Summary object:', summary);
    if (!summary) {
      console.log('No summary data available');
      return;
    }
    const text = `Транскрипция:\n${summary.transcript}\n\nКраткое содержание:\n${summary.summary}`;
    console.log('Generated text:', text);
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "summary.txt";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  };

  const handleFileUploadStart = () => {
    setStatus('processing');
    localStorage.setItem('summaryStatus', 'processing');
  };

  const handleClear = () => {
    setSummary(null);
    setStatus('idle');
    setError(null);
    localStorage.removeItem('summaryData');
    localStorage.setItem('summaryStatus', 'idle');
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #e3f0ff 0%, #f8fbff 100%)', 
      py: 8, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      <Container maxWidth="md">
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 700, 
            color: '#1976d2', 
            mb: 4, 
            textAlign: 'center', 
            fontFamily: 'Montserrat, Arial, sans-serif' 
          }}
        >
          Суммаризация аудио и видео
        </Typography>
        
        <Paper 
          elevation={4} 
          sx={{ 
            p: 4, 
            borderRadius: 4, 
            background: 'rgba(255,255,255,0.95)', 
            mx: 'auto', 
            maxWidth: 600 
          }}
        >
          {!summary && status !== 'processing' && (
            <FileUpload onSuccess={handleSuccess} onError={handleError} onUploadStart={handleFileUploadStart} isProcessing={status === 'processing'} />
          )}
          
          {error && (
            <Slide direction="up" in={!!error}>
              <Box sx={{ mt: 4 }}>
                <Paper elevation={3} sx={{ p: 2, bgcolor: 'error.light' }}>
                  <Typography color="error">{error}</Typography>
                </Paper>
              </Box>
            </Slide>
          )}

          {status === 'processing' && !summary && (
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="primary">Файл обрабатывается, пожалуйста, подождите...</Typography>
            </Box>
          )}

          {status === 'done' && summary && (
            <Slide direction="up" in={!!summary} mountOnEnter unmountOnExit>
              <Box sx={{ mt: 4 }}>
                <SummaryView 
                  transcript={summary.transcript}
                  summary={summary.summary}
                  onSummaryChange={handleSummaryChange}
                  onSave={handleSave}
                  onDownload={handleDownload}
                  isLoading={savingStatus === 'saving'}
                  isAuthenticated={isAuthenticated}
                />
                
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    onClick={handleClear}
                  >
                    Загрузить новый файл
                  </Button>
                </Box>
              </Box>
            </Slide>
          )}
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

export default Summarize; 