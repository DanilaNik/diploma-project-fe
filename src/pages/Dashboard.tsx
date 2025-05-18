import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, CircularProgress, Paper, Card, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { summarizationService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import AddIcon from '@mui/icons-material/Add';
import DescriptionIcon from '@mui/icons-material/Description';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { styled } from '@mui/material/styles';
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
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    },
}));

const Dashboard: React.FC = () => {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const data = await summarizationService.getRequests();
                setRequests(data);
            } catch (err) {
                setError('Ошибка при загрузке истории запросов');
                console.error('Error fetching requests:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    const handleNewRequest = () => {
        navigate('/summarize');
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
                    <Box sx={{ textAlign: 'center', maxWidth: '600px', mx: 'auto' }}>
                        <Typography variant="h4" component="h1" sx={{ color: '#1976d2', fontWeight: 'bold', mb: 1 }}>
                            История ваших запросов
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                            Здесь собраны все ваши запросы на суммаризацию аудио и видео файлов
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleNewRequest}
                            startIcon={<AddIcon />}
                            sx={{
                                fontWeight: 700,
                                fontFamily: 'Montserrat, Arial, sans-serif',
                                px: 3,
                                py: 1.5,
                                borderRadius: 2,
                                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)',
                                '&:hover': {
                                    boxShadow: '0 6px 16px rgba(25, 118, 210, 0.3)',
                                },
                            }}
                        >
                            Создать запрос
                        </Button>
                    </Box>
                </StyledPaper>

                {error && (
                    <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>
                        {error}
                    </Typography>
                )}

                {requests.length === 0 ? (
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
                                У вас пока нет запросов
                            </Typography>
                        </Box>
                    </StyledPaper>
                ) : (
                    requests.map((request) => (
                        <StyledCard key={request.id} sx={{ cursor: 'pointer' }} onClick={() => navigate(`/summary/${request.id}`)}>
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
                    ))
                )}
            </Container>
        </Box>
    );
};

export default Dashboard; 