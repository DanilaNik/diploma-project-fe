import React, { useState } from 'react';
import { Box, Paper, Typography, Button, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, CircularProgress } from '@mui/material';
import { summarizationService } from '../services/api';
import TranslateIcon from '@mui/icons-material/Translate';

interface SummarizationResultProps {
  transcript: string;
  summary: string;
}

const languages = [
  { code: 'ru', name: 'Русский' },
  { code: 'en', name: 'English' },
  { code: 'zh', name: '中文' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' }
];

export const SummarizationResult: React.FC<SummarizationResultProps> = ({ transcript, summary }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLanguageChange = (event: SelectChangeEvent) => {
    setSelectedLanguage(event.target.value);
  };

  const handleTranslate = async () => {
    setIsTranslating(true);
    setError(null);
    try {
      const translated = await summarizationService.translateText(summary, selectedLanguage);
      setTranslatedText(translated);
    } catch (err) {
      setError('Ошибка при переводе текста');
      console.error('Translation error:', err);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Транскрипция
        </Typography>
        <Box 
          sx={{ 
            height: '400px', 
            overflowY: 'auto', 
            backgroundColor: '#f8f9fa',
            borderRadius: 1,
            p: 2,
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: '#f1f1f1',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#888',
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: '#555',
              },
            },
          }}
        >
          <Typography 
            variant="body1" 
            sx={{ 
              whiteSpace: 'pre-wrap',
              fontFamily: 'monospace',
              fontSize: '0.9rem',
              lineHeight: 1.6,
              color: '#2c3e50',
            }}
          >
            {transcript}
          </Typography>
        </Box>
      </Paper>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Резюме
        </Typography>
        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mb: 3 }}>
          {summary}
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 3 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="translation-language-label">Язык перевода</InputLabel>
            <Select
              labelId="translation-language-label"
              value={selectedLanguage}
              label="Язык перевода"
              onChange={handleLanguageChange}
            >
              {languages.map((lang) => (
                <MenuItem key={lang.code} value={lang.code}>
                  {lang.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            startIcon={<TranslateIcon />}
            onClick={handleTranslate}
            disabled={isTranslating}
          >
            {isTranslating ? (
              <>
                <CircularProgress size={24} sx={{ mr: 1 }} />
                Перевод...
              </>
            ) : (
              'Перевести'
            )}
          </Button>
        </Box>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        {translatedText && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Перевод
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
              {translatedText}
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
}; 