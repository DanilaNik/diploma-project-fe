import React, { useState } from 'react';
import { Box, Button, Typography, CircularProgress, Paper, Alert, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { summarizationService } from '../services/api';

interface FileUploadProps {
  onSuccess?: (result: any) => void;
  onError?: (error: string) => void;
  onUploadStart?: () => void;
  isProcessing?: boolean;
}

const languages = [
  { code: 'ru', name: 'Русский' },
  { code: 'en', name: 'English' },
  { code: 'zh', name: '中文' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' }
];

const FileUpload: React.FC<FileUploadProps> = ({ onSuccess, onError, onUploadStart, isProcessing }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('ru');
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleLanguageChange = (event: SelectChangeEvent) => {
    setSelectedLanguage(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedFile) {
      setError('Пожалуйста, выберите файл');
      return;
    }

    onUploadStart?.();
    setIsLoading(true);
    setError(null);

    try {
      const result = await summarizationService.uploadFile(selectedFile, selectedLanguage);
      onSuccess?.(result);
      setSelectedFile(null);
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Произошла ошибка при загрузке файла';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        maxWidth: 600,
        mx: 'auto',
        my: 4,
      }}
    >
      <Typography variant="h5" component="h2" gutterBottom>
        Загрузите видео или аудио файл
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <FormControl fullWidth>
          <InputLabel id="language-select-label">Язык аудио</InputLabel>
          <Select
            labelId="language-select-label"
            value={selectedLanguage}
            label="Язык аудио"
            onChange={handleLanguageChange}
          >
            {languages.map((lang) => (
              <MenuItem key={lang.code} value={lang.code}>
                {lang.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box
        sx={{
          width: '100%',
          border: '2px dashed',
          borderColor: 'primary.main',
          borderRadius: 1,
          p: 3,
          textAlign: 'center',
          cursor: 'pointer',
          '&:hover': {
            borderColor: 'primary.dark',
            backgroundColor: 'action.hover',
          },
        }}
      >
        <input
          type="file"
          accept="video/*,audio/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          id="file-upload"
        />
        <label htmlFor="file-upload">
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main' }} />
            <Typography variant="body1">
              {selectedFile ? selectedFile.name : 'Нажмите для выбора файла'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Поддерживаемые форматы: MP4, MP3, WAV, AVI
            </Typography>
            <Typography sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1, color: 'primary.main', fontWeight: 500, fontFamily: 'Montserrat, Arial, sans-serif', fontSize: 15 }}>
              <svg style={{ marginRight: 6 }} width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="12" fill="#e3f0ff"/><path d="M12 8v4" stroke="#1976d2" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="16" r="1" fill="#1976d2"/></svg>
              Максимальный размер файла — 100 МБ
            </Typography>
          </Box>
        </label>
      </Box>

      {error && (
        <Alert severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={!selectedFile || isLoading || isProcessing}
        sx={{ mt: 2 }}
      >
        {(isLoading || isProcessing) ? (
          <>
            <CircularProgress size={24} sx={{ mr: 1 }} />
            Загрузка...
          </>
        ) : (
          'Загрузить'
        )}
      </Button>
    </Paper>
  );
};

export default FileUpload; 