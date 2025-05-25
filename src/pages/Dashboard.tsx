import React, { useState, useEffect, useCallback } from 'react';
import { Box, Container, Typography, Button, CircularProgress, Paper, Card, Divider, TextField, IconButton, InputAdornment, Tooltip, Chip, Fade, Collapse } from '@mui/material';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { summarizationService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import AddIcon from '@mui/icons-material/Add';
import DescriptionIcon from '@mui/icons-material/Description';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import TuneIcon from '@mui/icons-material/Tune';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { styled, alpha } from '@mui/material/styles';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    marginBottom: theme.spacing(3),
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
}));

const StyledCard = styled(Card)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    padding: theme.spacing(3),
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid rgba(0, 0, 0, 0.08)',
    transition: 'all 0.2s ease-in-out',
    overflow: 'hidden',
    position: 'relative',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        '&::before': {
            opacity: 1,
        }
    },
    '&::before': {
        content: '""',
        position: 'absolute',
        left: 0,
        top: 0,
        width: '4px',
        height: '100%',
        backgroundColor: '#1976d2',
        opacity: 0,
        transition: 'opacity 0.2s ease-in-out',
    }
}));

const SearchContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(3),
    alignItems: 'center',
    background: 'rgba(25, 118, 210, 0.03)',
    borderRadius: 12,
    padding: theme.spacing(2),
    boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.05)',
    border: '1px solid rgba(25, 118, 210, 0.1)',
}));

const SearchField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        borderRadius: 8,
        backgroundColor: '#fff',
        '&:hover fieldset': {
            borderColor: '#1976d2',
        },
        transition: 'all 0.3s ease',
        '&:focus-within': {
            boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.1)',
        }
    },
    '& .MuiInputLabel-root': {
        fontSize: '0.9rem',
        fontWeight: 500,
        '&.Mui-focused': {
            color: '#1976d2',
        },
    },
    '& .MuiInputBase-input': {
        padding: '10px 14px',
    }
}));

const SearchButton = styled(IconButton)(({ theme }) => ({
    backgroundColor: '#1976d2',
    color: 'white',
    borderRadius: 8,
    padding: theme.spacing(1),
    height: 40,
    width: 40,
    boxShadow: '0 4px 10px rgba(25, 118, 210, 0.2)',
    '&:hover': {
        backgroundColor: '#1565c0',
        boxShadow: '0 6px 12px rgba(25, 118, 210, 0.3)',
    },
    transition: 'all 0.2s ease',
}));

const FilterChip = styled(Chip)(({ theme }) => ({
    margin: theme.spacing(0.5),
    backgroundColor: 'rgba(25, 118, 210, 0.08)',
    borderRadius: 16,
    '& .MuiChip-label': {
        fontWeight: 500,
    },
    '& .MuiChip-deleteIcon': {
        color: '#1976d2',
    },
}));

const ResultInfo = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexWrap: 'wrap',
    margin: theme.spacing(2, 0),
    alignItems: 'flex-start',
    gap: theme.spacing(1),
}));

const ResultsContainer = styled(Box)(({ theme }) => ({
    marginTop: theme.spacing(2),
}));

const Dashboard: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filenameQuery, setFilenameQuery] = useState(() => searchParams.get('filename') || '');
    const [contentQuery, setContentQuery] = useState(() => searchParams.get('content') || '');
    const [searching, setSearching] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    const fetchRequests = async (filename?: string, content?: string) => {
        setLoading(true);
        try {
            const data = await summarizationService.getRequests(filename, content);
            setRequests(data);
        } catch (err) {
            setError('Ошибка при загрузке истории запросов');
            console.error('Error fetching requests:', err);
        } finally {
            setLoading(false);
            setSearching(false);
        }
    };

    // Обновление URL с параметрами поиска
    const updateSearchParams = useCallback((filename: string, content: string) => {
        const params = new URLSearchParams();
        if (filename) params.set('filename', filename);
        if (content) params.set('content', content);
        setSearchParams(params);
    }, [setSearchParams]);

    // Debounced search function
    const debouncedSearch = useCallback(
        debounce((filename: string, content: string) => {
            fetchRequests(filename || undefined, content || undefined);
            updateSearchParams(filename, content);
        }, 500),
        [updateSearchParams]
    );

    useEffect(() => {
        // Первоначальная загрузка с учетом параметров URL
        const initialFilename = searchParams.get('filename') || '';
        const initialContent = searchParams.get('content') || '';
        
        if (initialFilename || initialContent) {
            fetchRequests(initialFilename || undefined, initialContent || undefined);
        } else {
            fetchRequests();
        }
    }, [searchParams]);

    // Effect for handling real-time search
    useEffect(() => {
        if (filenameQuery !== '' || contentQuery !== '') {
            setSearching(true);
            debouncedSearch(filenameQuery, contentQuery);
        }
    }, [filenameQuery, contentQuery, debouncedSearch]);

    const handleSearch = () => {
        setSearching(true);
        fetchRequests(filenameQuery || undefined, contentQuery || undefined);
        updateSearchParams(filenameQuery, contentQuery);
    };

    const handleClearSearch = () => {
        setFilenameQuery('');
        setContentQuery('');
        setSearchParams(new URLSearchParams());
        fetchRequests();
    };

    const handleClearFilename = () => {
        setFilenameQuery('');
        updateSearchParams('', contentQuery);
    };

    const handleClearContent = () => {
        setContentQuery('');
        updateSearchParams(filenameQuery, '');
    };

    const handleFilenameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilenameQuery(e.target.value);
    };

    const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setContentQuery(e.target.value);
    };

    const handleNewRequest = () => {
        navigate('/summarize');
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            handleSearch();
        } else if (event.key === 'Escape') {
            handleClearSearch();
        }
    };

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: 'linear-gradient(135deg, #e3f0ff 0%, #f8fbff 100%)',
                    pt: { xs: 8, sm: 9 },
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #e3f0ff 0%, #f8fbff 100%)',
                pt: { xs: 8, sm: 9 },
                pb: 4,
            }}
        >
            <Container maxWidth="md">
                <StyledPaper>
                    <Box sx={{ textAlign: 'center', maxWidth: '700px', mx: 'auto' }}>
                        <Typography variant="h4" component="h1" sx={{ 
                            color: '#1976d2', 
                            fontWeight: 'bold', 
                            mb: 3,
                            position: 'relative',
                            display: 'inline-block',
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                width: '60px',
                                height: '3px',
                                backgroundColor: '#1976d2',
                                bottom: '-10px',
                                left: 'calc(50% - 30px)',
                                borderRadius: '2px'
                            }
                        }}>
                            История ваших запросов
                        </Typography>
                        
                        <SearchContainer sx={{ mb: 4, mt: 5 }}>
                            <Box sx={{ display: 'flex', gap: 2, flex: 1, alignItems: 'center' }}>
                                <SearchField
                                    label="Поиск по названию файла"
                                    placeholder="Введите название файла..."
                                    variant="outlined"
                                    value={filenameQuery}
                                    onChange={handleFilenameChange}
                                    onKeyDown={handleKeyDown}
                                    fullWidth
                                    size="small"
                                    InputProps={{
                                        endAdornment: filenameQuery ? (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="clear search"
                                                    onClick={handleClearFilename}
                                                    edge="end"
                                                    size="small"
                                                >
                                                    <ClearIcon fontSize="small" />
                                                </IconButton>
                                            </InputAdornment>
                                        ) : null,
                                    }}
                                />
                                <SearchField
                                    label="Поиск по содержимому"
                                    placeholder="Введите текст для поиска..."
                                    variant="outlined"
                                    value={contentQuery}
                                    onChange={handleContentChange}
                                    onKeyDown={handleKeyDown}
                                    fullWidth
                                    size="small"
                                    InputProps={{
                                        endAdornment: contentQuery ? (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="clear search"
                                                    onClick={handleClearContent}
                                                    edge="end"
                                                    size="small"
                                                >
                                                    <ClearIcon fontSize="small" />
                                                </IconButton>
                                            </InputAdornment>
                                        ) : null,
                                    }}
                                />
                            </Box>
                            <Tooltip title="Искать">
                                <SearchButton 
                                    onClick={handleSearch}
                                    disabled={searching}
                                    aria-label="поиск"
                                >
                                    {searching ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
                                </SearchButton>
                            </Tooltip>
                        </SearchContainer>
                        
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                            Или вы можете создать новый запрос
                        </Typography>
                        
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleNewRequest}
                            startIcon={<AddIcon />}
                            sx={{
                                fontWeight: 600,
                                fontFamily: 'Montserrat, Arial, sans-serif',
                                px: 4,
                                py: 1.5,
                                borderRadius: 2,
                                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)',
                                '&:hover': {
                                    boxShadow: '0 6px 16px rgba(25, 118, 210, 0.3)',
                                    transform: 'translateY(-2px)'
                                },
                                transition: 'all 0.2s ease',
                            }}
                        >
                            Создать запрос
                        </Button>
                    </Box>
                </StyledPaper>

                {(filenameQuery || contentQuery) && !loading && (
                    <Fade in={!loading} timeout={500}>
                        <ResultInfo>
                            <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                background: alpha('#1976d2', 0.05), 
                                borderRadius: 2,
                                px: 1.5,
                                py: 0.75,
                                mb: 0.5
                            }}>
                                <FilterAltIcon sx={{ fontSize: 18, color: '#1976d2', mr: 0.5 }} />
                                <Typography variant="body2" color="primary" fontWeight={500}>
                                    {requests.length > 0 
                                        ? `Найдено: ${requests.length} результатов` 
                                        : 'Ничего не найдено'}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {filenameQuery && (
                                    <FilterChip
                                        label={`Файл: ${filenameQuery}`}
                                        onDelete={handleClearFilename}
                                        size="small"
                                    />
                                )}
                                {contentQuery && (
                                    <FilterChip
                                        label={`Текст: ${contentQuery}`}
                                        onDelete={handleClearContent}
                                        size="small"
                                    />
                                )}
                                {(filenameQuery || contentQuery) && (
                                    <FilterChip
                                        label="Сбросить всё"
                                        onDelete={handleClearSearch}
                                        size="small"
                                        sx={{ 
                                            backgroundColor: 'rgba(211, 47, 47, 0.08)', 
                                            '& .MuiChip-deleteIcon': { color: '#d32f2f' } 
                                        }}
                                    />
                                )}
                            </Box>
                        </ResultInfo>
                    </Fade>
                )}

                {error && (
                    <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>
                        {error}
                    </Typography>
                )}

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : requests.length === 0 ? (
                    <StyledPaper>
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                            <DescriptionIcon sx={{ fontSize: 48, color: '#bdbdbd', mb: 2 }} />
                            <Typography 
                                variant="h6" 
                                sx={{ 
                                    color: '#666',
                                    fontSize: { xs: '1rem', sm: '1.1rem' }
                                }}
                            >
                                {filenameQuery || contentQuery 
                                  ? 'По вашему запросу ничего не найдено' 
                                  : 'У вас пока нет запросов'}
                            </Typography>
                        </Box>
                    </StyledPaper>
                ) : (
                    <ResultsContainer>
                        <Fade in={!loading} timeout={800}>
                            <Box>
                                {requests.map((request, index) => (
                                    <Fade in={true} timeout={(index + 1) * 100} key={request.id}>
                                        <StyledCard 
                                            sx={{ cursor: 'pointer' }} 
                                            onClick={() => navigate(`/summary/${request.id}`)}
                                        >
                                            <Box 
                                                sx={{ 
                                                    display: 'flex', 
                                                    flexDirection: { xs: 'column', sm: 'row' },
                                                    justifyContent: 'space-between', 
                                                    alignItems: { xs: 'flex-start', sm: 'center' }, 
                                                    mb: 2,
                                                    gap: 1
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <DescriptionIcon sx={{ color: '#1976d2' }} />
                                                    <Typography 
                                                        variant="h6" 
                                                        sx={{ 
                                                            color: '#1a1a1a', 
                                                            fontWeight: 500,
                                                            fontSize: { xs: '1rem', sm: '1.1rem' }
                                                        }}
                                                    >
                                                        {request.filename}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <AccessTimeIcon sx={{ color: '#666', fontSize: '1rem' }} />
                                                    <Typography 
                                                        variant="body2" 
                                                        sx={{ 
                                                            color: '#666',
                                                            fontSize: { xs: '0.875rem', sm: '0.9rem' }
                                                        }}
                                                    >
                                                        {format(new Date(request.created_at), 'd MMMM yyyy, HH:mm', { locale: ru })}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Divider sx={{ my: 2 }} />
                                        </StyledCard>
                                    </Fade>
                                ))}
                            </Box>
                        </Fade>
                    </ResultsContainer>
                )}
            </Container>
        </Box>
    );
};

// Debounce helper function
function debounce<F extends (...args: any[]) => any>(func: F, wait: number) {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    
    return function(...args: Parameters<F>) {
        if (timeout) {
            clearTimeout(timeout);
        }
        
        timeout = setTimeout(() => {
            func(...args);
        }, wait);
    };
}

export default Dashboard; 