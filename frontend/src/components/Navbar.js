import React from 'react';

const Navbar = ({ setCurrentView }) => {
    return (
        <nav>
            <ul>
                <li><button onClick={() => setCurrentView('landing')}>Home</button></li>
                <li><button onClick={() => setCurrentView('parentSignup')}>Parent Sign Up</button></li>
                <li><button onClick={() => setCurrentView('daycareSignup')}>Daycare Sign Up</button></li>
                <li><button onClick={() => setCurrentView('login')}>Login</button></li>
                <li><button onClick={() => setCurrentView('daycares')}>Daycares</button></li>
            </ul>
        </nav>
    );
};

export default Navbar;
