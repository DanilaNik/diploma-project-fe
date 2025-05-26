import React from 'react';
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  IconButton,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';

interface SummaryViewProps {
  transcript: string;
  summary: string;
  onSummaryChange: (summary: string) => void;
  onSave: () => void;
  onDownload: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export const SummaryView: React.FC<SummaryViewProps> = ({
  transcript,
  summary,
  onSummaryChange,
  onSave,
  onDownload,
  isLoading,
  isAuthenticated,
}) => {
  const [isEditing, setIsEditing] = React.useState(false);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    onSave();
    setIsEditing(false); // Выключаем режим редактирования после сохранения
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Транскрипция
        </Typography>
        <Box sx={{ maxHeight: 320, overflowY: 'auto', background: '#fff', borderRadius: 2, p: 2, border: '1px solid #e3e3e3' }}>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', color: '#2c3e50', fontSize: '1.05rem', lineHeight: 1.7 }}>
            {transcript}
          </Typography>
        </Box>
      </Paper>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Краткое содержание</Typography>
          <Box>
            <Tooltip title={isEditing ? "Сохранить изменения" : "Редактировать"}>
              <IconButton
                onClick={handleEditToggle}
                disabled={isLoading}
                color={isEditing ? "primary" : "default"}
              >
                {isEditing ? <CheckIcon /> : <EditIcon />}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        <TextField
          fullWidth
          multiline
          rows={6}
          value={summary}
          onChange={(e) => onSummaryChange(e.target.value)}
          variant="outlined"
          disabled={!isEditing || isLoading}
          sx={{ mb: 2 }}
        />
        <Box sx={{ display: 'flex', gap: 2 }}>
          {isAuthenticated && isEditing && (
            <Button
              variant="contained"
              color="primary"
              startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? 'СОХРАНЕНИЕ...' : 'СОХРАНИТЬ'}
            </Button>
          )}
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={onDownload}
            disabled={isLoading}
          >
            СКАЧАТЬ
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}; 