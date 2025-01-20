import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DogCard from '../components/DogCard';

describe('DogCard Component', () => {
    const mockDog = {
        id: '1',
        name: 'Buddy',
        breed: 'Labrador',
        age: 3,
        zip_code: '12345',
    };

    const mockToggleFavorite = jest.fn();

    test('renders DogCard component correctly', () => {
        render(<DogCard dog={mockDog} isFavorite={false} toggleFavorite={mockToggleFavorite} />);

        // Check if the dog's details are rendered
        expect(screen.getByText(/Buddy/i)).toBeInTheDocument();
        expect(screen.getByText(/Labrador/i)).toBeInTheDocument();
        expect(screen.getByText(/Age: 3/i)).toBeInTheDocument();
        expect(screen.getByText(/Location: 12345/i)).toBeInTheDocument();

        // Check if the favorite button is rendered
        expect(screen.getByText(/Favorite/i)).toBeInTheDocument();
    });

    test('calls toggleFavorite when the button is clicked', () => {
        render(<DogCard dog={mockDog} isFavorite={false} toggleFavorite={mockToggleFavorite} />);

        // Simulate button click
        fireEvent.click(screen.getByText(/Favorite/i));

        // Check if the toggleFavorite function is called
        expect(mockToggleFavorite).toHaveBeenCalledWith(mockDog);
    });
});
