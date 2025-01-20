import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button } from '@mui/material';

const DogCard = ({ dog, toggleFavorite, isFavorite }) => {
    return (
        <Card
            sx={{
                maxWidth: 345,
                margin: 'auto',
                boxShadow: 3,
                backgroundColor: '#f0f8ff', // Light blue background
                border: '1px solid #e0e0e0',
            }}
        >
            <CardMedia
                component="img"
                height="200"
                image={dog.img || '/placeholder-image.jpg'}
                alt={dog.name || 'Dog'}
                sx={{ borderRadius: '4px', objectFit: 'cover' }}
            />
            <CardContent>
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 'bold',
                        color: '#2c3e50', // Dark blue for titles
                        textAlign: 'center',
                        marginBottom: '10px',
                    }}
                >
                    {dog.name || 'Unknown'}
                </Typography>
                <Typography sx={{ color: '#34495e', marginBottom: '5px' }}>
                    <strong>Breed:</strong> {dog.breed || 'Unknown'}
                </Typography>
                <Typography sx={{ color: '#34495e', marginBottom: '5px' }}>
                    <strong>Age:</strong> {dog.age || 'Unknown'}
                </Typography>
                <Typography sx={{ color: '#34495e', marginBottom: '10px' }}>
                    <strong>Location:</strong> {dog.zip_code || 'Unknown'}
                </Typography>
                <Button
                    variant="contained"
                    color={isFavorite ? 'error' : 'primary'}
                    onClick={() => toggleFavorite(dog)}
                    sx={{
                        width: '100%',
                        fontWeight: 'bold',
                        padding: '10px',
                        backgroundColor: isFavorite ? '#e74c3c' : '#3498db', // Red for unfavorite, blue for favorite
                    }}
                >
                    {isFavorite ? 'Unfavorite' : 'Favorite'}
                </Button>
            </CardContent>
        </Card>
    );
};

export default DogCard;
