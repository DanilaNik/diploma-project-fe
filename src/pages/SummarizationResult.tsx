import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { SummarizationResult } from '../components/SummarizationResult';
import { useLocation } from 'react-router-dom';

export const SummarizationResultPage: React.FC = () => {
  const location = useLocation();
  const { transcript, summary } = location.state || {};

  if (!transcript || !summary) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="h5" color="error">
            Результаты не найдены
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Результаты суммаризации
        </Typography>
        <SummarizationResult transcript={transcript} summary={summary} />
      </Box>
    </Container>
  );
}; 