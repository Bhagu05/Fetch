import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Match = () => {
    const { favorites } = useAuth();
    const [match, setMatch] = useState(null);

    const findMatch = async () => {
        try {
            const response = await axios.post('https://frontend-take-home-service.fetch.com/dogs/match', favorites.map((dog) => dog.id), { withCredentials: true });
            setMatch(response.data.match);
        } catch (error) {
            alert('Failed to find a match.');
        }
    };

    return (
        <div>
            <h1>Match Your Dog</h1>
            <button onClick={findMatch}>Find Match</button>
            {match && <div>Your match is: {match}</div>}
        </div>
    );
};

export default Match;
