import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { AuthProvider } from '../context/AuthContext';
import Search from '../pages/Search';

// Mock Axios
const mock = new MockAdapter(axios);

describe('Search Component', () => {
    beforeEach(() => {
        mock.reset();
    });

    test('renders Search component correctly', () => {
        render(
            <AuthProvider>
                <Search />
            </AuthProvider>
        );

        // Check if the heading is rendered
        expect(screen.getByText(/Search Dogs/i)).toBeInTheDocument();

        // Check if the breed selector and sort button are rendered
        expect(screen.getByLabelText(/Breed/i)).toBeInTheDocument();
        expect(screen.getByText(/Sort/i)).toBeInTheDocument();
    });

    test('fetches and displays breeds', async () => {
        // Mock breeds API response
        mock.onGet('https://frontend-take-home-service.fetch.com/dogs/breeds').reply(200, ['Labrador', 'Beagle']);

        render(
            <AuthProvider>
                <Search />
            </AuthProvider>
        );

        // Wait for breeds to load
        await waitFor(() => {
            expect(screen.getByText('Labrador')).toBeInTheDocument();
            expect(screen.getByText('Beagle')).toBeInTheDocument();
        });
    });

    test('fetches and displays dogs based on breed and sort order', async () => {
        // Mock search and dogs API response
        mock
            .onGet('https://frontend-take-home-service.fetch.com/dogs/search', {
                params: { breeds: ['Labrador'], size: 10, from: 0, sort: 'breed:asc' },
            })
            .reply(200, {
                resultIds: ['dog1', 'dog2'],
                next: true,
            });

        mock.onPost('https://frontend-take-home-service.fetch.com/dogs').reply(200, [
            { id: 'dog1', name: 'Buddy', breed: 'Labrador', age: 3, zip_code: '12345' },
            { id: 'dog2', name: 'Charlie', breed: 'Labrador', age: 5, zip_code: '67890' },
        ]);

        render(
            <AuthProvider>
                <Search />
            </AuthProvider>
        );

        // Simulate selecting a breed
        fireEvent.change(screen.getByLabelText(/Breed/i), { target: { value: 'Labrador' } });

        // Wait for dogs to load
        await waitFor(() => {
            expect(screen.getByText('Buddy')).toBeInTheDocument();
            expect(screen.getByText('Charlie')).toBeInTheDocument();
        });
    });

    test('handles API errors gracefully', async () => {
        // Mock error response
        mock.onGet('https://frontend-take-home-service.fetch.com/dogs/breeds').reply(500);

        render(
            <AuthProvider>
                <Search />
            </AuthProvider>
        );

        // Wait for the error message
        await waitFor(() => {
            expect(screen.getByText(/Failed to fetch breeds/i)).toBeInTheDocument();
        });
    });
});
