import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { summarizationService } from '../services/api';
import { Button, Card, Typography, Box, Container, Paper, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    marginTop: theme.spacing(3),
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '15px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
}));

const StyledCard = styled(Card)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '10px',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
    },
}));

const History: React.FC = () => {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }
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
    }, [navigate]);

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
                py: 4,
            }}
        >
            <Container maxWidth="md">
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Typography variant="h4" component="h1" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
                        История запросов
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleNewRequest}
                        sx={{
                            borderRadius: '20px',
                            textTransform: 'none',
                            px: 3,
                            py: 1,
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        Новый запрос
                    </Button>
                </Box>

                {error && (
                    <Typography color="error" sx={{ mb: 2 }}>
                        {error}
                    </Typography>
                )}

                {requests.length === 0 ? (
                    <StyledPaper>
                        <Typography variant="h6" align="center" sx={{ color: '#666' }}>
                            У вас пока нет запросов
                        </Typography>
                    </StyledPaper>
                ) : (
                    requests.map((request) => (
                        <StyledCard key={request.id}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 'medium' }}>
                                    {request.filename}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {format(new Date(request.created_at), 'd MMMM yyyy, HH:mm', { locale: ru })}
                                </Typography>
                            </Box>
                            <Typography variant="body1" sx={{ mb: 2, color: '#333' }}>
                                {request.summary}
                            </Typography>
                        </StyledCard>
                    ))
                )}
            </Container>
        </Box>
    );
};

export default History; 