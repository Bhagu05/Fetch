import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DogCard from '../components/DogCard';
import Pagination from '../components/Pagination';
import { useAuth } from '../context/AuthContext';
import { Box, Typography, Button, MenuItem, Select, InputLabel, FormControl, Grid } from '@mui/material';

const Search = () => {
    const [dogs, setDogs] = useState([]);
    const [breeds, setBreeds] = useState([]);
    const [selectedBreed, setSelectedBreed] = useState('');
    const [page, setPage] = useState(0);
    const [sortOrder, setSortOrder] = useState('asc');
    const [hasNext, setHasNext] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { favorites, setFavorites } = useAuth();

    // Fetch breeds on component mount
    useEffect(() => {
        const fetchBreeds = async () => {
            try {
                const response = await axios.get(
                    'https://frontend-take-home-service.fetch.com/dogs/breeds',
                    { withCredentials: true }
                );
                setBreeds(response.data || []);
            } catch (err) {
                console.error('Error fetching breeds:', err);
                setError('Failed to fetch breeds. Please try again later.');
            }
        };
        fetchBreeds();
    }, []);

    // Fetch dogs based on filters, pagination, and sorting
    useEffect(() => {
        const fetchDogs = async () => {
            setLoading(true);
            setError('');
            try {
                console.log('Fetching dogs with params:', {
                    breeds: selectedBreed ? [selectedBreed] : [],
                    size: 10,
                    from: page * 10,
                    sort: `breed:${sortOrder}`,
                });

                const searchResponse = await axios.get(
                    'https://frontend-take-home-service.fetch.com/dogs/search',
                    {
                        params: {
                            breeds: selectedBreed ? [selectedBreed] : [],
                            size: 10,
                            from: page * 10,
                            sort: `breed:${sortOrder}`,
                        },
                        withCredentials: true,
                    }
                );

                const dogIds = searchResponse.data.resultIds || [];
                setHasNext(!!searchResponse.data.next);

                if (dogIds.length > 0) {
                    const dogsResponse = await axios.post(
                        'https://frontend-take-home-service.fetch.com/dogs',
                        dogIds,
                        { withCredentials: true }
                    );
                    const sortedDogs =
                        sortOrder === 'asc'
                            ? dogsResponse.data.sort((a, b) => a.breed.localeCompare(b.breed))
                            : dogsResponse.data.sort((a, b) => b.breed.localeCompare(a.breed));

                    setDogs(sortedDogs || []);
                } else {
                    setDogs([]);
                }
            } catch (err) {
                console.error('Error fetching dogs:', err);
                setError('Failed to fetch dogs. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchDogs();
    }, [selectedBreed, page, sortOrder]);

    // Toggle favorite dogs
    const toggleFavorite = (dog) => {
        setFavorites((prevFavorites) =>
            prevFavorites.some((fav) => fav.id === dog.id)
                ? prevFavorites.filter((fav) => fav.id !== dog.id)
                : [...prevFavorites, dog]
        );
    };

    // Generate match from favorite dogs
    const generateMatch = async () => {
        try {
            const dogIds = favorites.map((dog) => dog.id);
            const matchResponse = await axios.post(
                'https://frontend-take-home-service.fetch.com/dogs/match',
                dogIds,
                { withCredentials: true }
            );

            const matchedDogId = matchResponse.data.match;

            if (matchedDogId) {
                const matchedDogResponse = await axios.post(
                    'https://frontend-take-home-service.fetch.com/dogs',
                    [matchedDogId],
                    { withCredentials: true }
                );

                const matchedDog = matchedDogResponse.data[0];
                alert(
                    `Your match is:\n\nName: ${matchedDog.name}\nBreed: ${matchedDog.breed}\nAge: ${matchedDog.age}\nLocation: ${matchedDog.zip_code}`
                );
            } else {
                alert('No match found. Please favorite more dogs and try again.');
            }
        } catch (error) {
            console.error('Error generating match:', error);
            alert('Failed to generate a match. Please try again.');
        }
    };

    return (
        <Box sx={{ backgroundColor: '#f9f9f9', minHeight: '100vh', padding: '20px' }}>
            <Typography variant="h4" gutterBottom align="center" sx={{ color: '#333', marginBottom: '20px' }}>
                Search Dogs
            </Typography>

            {/* Filter and Sort Section */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '20px',
                    marginBottom: '20px',
                }}
            >
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Breed</InputLabel>
                    <Select
                        value={selectedBreed}
                        onChange={(e) => {
                            setSelectedBreed(e.target.value);
                            setPage(0); // Reset to page 0 when changing breed
                        }}
                        label="Breed"
                    >
                        <MenuItem value="">
                            <em>All Breeds</em>
                        </MenuItem>
                        {breeds.map((breed) => (
                            <MenuItem key={breed} value={breed}>
                                {breed}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Button
                    variant="contained"
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                >
                    Sort: {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                </Button>
            </Box>

            {/* Dog Cards */}
            <Grid container spacing={3}>
                {loading ? (
                    <Typography variant="h6" align="center" sx={{ width: '100%', marginTop: '20px' }}>
                        Loading dogs...
                    </Typography>
                ) : error ? (
                    <Typography variant="h6" align="center" sx={{ width: '100%', marginTop: '20px', color: 'red' }}>
                        {error}
                    </Typography>
                ) : dogs.length === 0 ? (
                    <Typography variant="h6" align="center" sx={{ width: '100%', marginTop: '20px' }}>
                        No dogs found. Try a different filter or reset the search.
                    </Typography>
                ) : (
                    dogs.map((dog) => (
                        <Grid item xs={12} sm={6} md={4} key={dog.id}>
                            <DogCard
                                dog={dog}
                                isFavorite={favorites.some((fav) => fav.id === dog.id)}
                                toggleFavorite={toggleFavorite}
                            />
                        </Grid>
                    ))
                )}
            </Grid>

            {/* Pagination Section */}
            <Pagination page={page} setPage={setPage} hasNext={hasNext} />

            {/* Generate Match Button */}
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={generateMatch}
                    disabled={favorites.length === 0}
                >
                    Generate Match
                </Button>
            </Box>
        </Box>
    );
};

export default Search;
