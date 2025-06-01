import React, { useState, useEffect } from 'react';
import { summarizationService } from '../services/api';
import { List, ListItem, ListItemText, Typography, Box, CircularProgress, Paper, Container } from '@mui/material';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '15px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '10px',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
    },
}));

interface Request {
    id: number;
    filename: string;
    status: string;
    created_at: string;
    summary?: string;
}

const RequestHistory: React.FC = () => {
    const [requests, setRequests] = useState<Request[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userEmail, setUserEmail] = useState<string>('');

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const data = await summarizationService.getRequests();
                setRequests(data);
                const email = localStorage.getItem('userEmail');
                if (email) {
                    setUserEmail(email);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Произошла ошибка при загрузке истории');
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

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
                {/* Приветственная карточка */}
                <StyledPaper>
                    <Typography variant="h4" component="h1" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
                        Добро пожаловать!
                    </Typography>
                </StyledPaper>

                {/* Карточка с email пользователя */}
                {userEmail && (
                    <StyledPaper>
                        <Typography variant="h6" sx={{ color: '#666' }}>
                            {userEmail}
                        </Typography>
                    </StyledPaper>
                )}

                {/* Карточка с историей запросов */}
                <StyledPaper>
                    <Typography variant="h5" component="h2" sx={{ color: '#1976d2', fontWeight: 'bold', mb: 3 }}>
                        История запросов
                    </Typography>

                    {error ? (
                        <Typography color="error" align="center">
                            {error}
                        </Typography>
                    ) : requests.length === 0 ? (
                        <Typography align="center" color="textSecondary">
                            История запросов пуста
                        </Typography>
                    ) : (
                        <List>
                            {requests.map((request) => (
                                <StyledListItem key={request.id}>
                                    <ListItemText
                                        primary={
                                            <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 'medium' }}>
                                                {request.filename}
                                            </Typography>
                                        }
                                        secondary={
                                            <>
                                                <Typography component="span" variant="body2" color="textPrimary" sx={{ display: 'block', mb: 1 }}>
                                                    {format(new Date(request.created_at), 'd MMMM yyyy, HH:mm', { locale: ru })}
                                                </Typography>
                                                <Typography variant="body1" sx={{ color: '#333' }}>
                                                    {request.summary}
                                                </Typography>
                                            </>
                                        }
                                    />
                                </StyledListItem>
                            ))}
                        </List>
                    )}
                </StyledPaper>
            </Container>
        </Box>
    );
};

export default RequestHistory; 