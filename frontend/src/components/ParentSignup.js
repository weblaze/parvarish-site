import React, { useState } from 'react';

const ParentSignup = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [role] = useState('parent'); // Default role

    const handleSignup = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:5000/parent/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password, email, phone, role }),
        });
        if (response.ok) {
            alert('Parent registered successfully!');
        } else {
            alert('Registration failed.');
        }
    };

    return (
        <form onSubmit={handleSignup}>
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="tel" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            <button type="submit">Sign Up</button>
        </form>
    );
};

export default ParentSignup;
