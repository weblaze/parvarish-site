import React, { useState } from 'react';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('parent');

    const handleSignup = async (e) => {
        e.preventDefault();
const response = await fetch('http://localhost:5000/register', {

            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password, role }),
        });
        if (response.ok) {
            alert('User registered successfully!');
        } else {
            alert('Registration failed.');
        }
    };

    return (
        <form onSubmit={handleSignup}>
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="parent">Parent</option>
                <option value="caregiver">Caregiver</option>
                <option value="daycare">Daycare</option>
            </select>
            <button type="submit">Sign Up</button>
        </form>
    );
};

export default Signup;
