import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login'; // Ensure the path is correct
import Search from './pages/Search'; // Ensure the path is correct
import Match from './pages/Match'; // Ensure the path is correct

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/search" element={<Search />} />
                <Route path="/match" element={<Match />} />
            </Routes>
        </Router>
    );
};

export default App;
