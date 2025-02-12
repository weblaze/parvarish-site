import React, { useState } from 'react';
import DaycareList from './components/DaycareList';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import ParentSignup from './components/ParentSignup';
import DaycareSignup from './components/DaycareSignup';
import Login from './components/Login';

const App = () => {
    const [currentView, setCurrentView] = useState('landing');

    const renderComponent = () => {
        switch (currentView) {
            case 'landing':
                return <LandingPage />;
            case 'login':
                return <Login />;
            case 'parentSignup':
                return <ParentSignup />;
            case 'daycareSignup':
                return <DaycareSignup />;
            case 'daycares':
                return <DaycareList />;
            default:
                return <LandingPage />;
        }
    };

    return (
        <div>
            <Navbar setCurrentView={setCurrentView} />
            {renderComponent()}
        </div>
    );
};

export default App;
