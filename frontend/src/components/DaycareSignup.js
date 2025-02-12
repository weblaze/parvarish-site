import React, { useState } from 'react';

const DaycareSignup = () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [capacity, setCapacity] = useState('');

    const handleSignup = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:5000/daycare/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, password, address, contactNumber, capacity }),
        });
        if (response.ok) {
            alert('Daycare registered successfully!');
        } else {
            alert('Registration failed.');
        }
    };

    return (
        <form onSubmit={handleSignup}>
            <input type="text" placeholder="Daycare Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} required />
            <input type="tel" placeholder="Contact Number" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} required />
            <input type="number" placeholder="Capacity" value={capacity} onChange={(e) => setCapacity(e.target.value)} required />
            <button type="submit">Sign Up</button>
        </form>
    );
};

export default DaycareSignup;
