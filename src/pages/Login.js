import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { TextField, Button, Box, Typography, CircularProgress } from '@mui/material';

const Login = () => {
    console.log('Login component rendered');

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { setUser } = useAuth();
    const navigate = useNavigate();

    // Input validation
    const validateInputs = () => {
        if (!name || !email) {
            setError('Both name and email are required.');
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Invalid email format.');
            return false;
        }
        setError('');
        return true;
    };

    // Handle login
    const handleLogin = async () => {
        if (!validateInputs()) return;

        setLoading(true);
        try {
            await axios.post(
                'https://frontend-take-home-service.fetch.com/auth/login',
                { name, email },
                { withCredentials: true }
            );
            setUser({ name, email });
            navigate('/search');
        } catch (error) {
            console.error('Login failed:', error);
            setError('Login failed. Please check your credentials and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                maxWidth: '400px',
                margin: '50px auto',
                padding: '20px',
                textAlign: 'center',
                backgroundColor: '#f9f9f9',
                borderRadius: '10px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                    transform: 'scale(1.02)',
                },
            }}
        >
            <Typography variant="h4" sx={{ marginBottom: '20px', color: '#333' }}>
                Login
            </Typography>
            {error && (
                <Typography variant="body2" sx={{ color: 'red', marginBottom: '10px' }}>
                    {error}
                </Typography>
            )}
            <TextField
                fullWidth
                label="Name"
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
                sx={{ marginBottom: '15px' }}
            />
            <TextField
                fullWidth
                label="Email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                helperText="Enter a valid email (e.g., name@example.com)"
                sx={{ marginBottom: '20px' }}
            />
            <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleLogin}
                disabled={loading}
                sx={{
                    fontWeight: 'bold',
                    padding: '10px',
                    transition: 'background-color 0.3s ease',
                    '&:hover': {
                        backgroundColor: loading ? '#ccc' : '#0056b3',
                    },
                }}
            >
                {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Login'}
            </Button>
        </Box>
    );
};

export default Login;
