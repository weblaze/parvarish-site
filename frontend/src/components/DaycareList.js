import React, { useEffect, useState } from 'react';

const DaycareList = () => {
    const [daycares, setDaycares] = useState([]);

    useEffect(() => {
        const fetchDaycares = async () => {
            const response = await fetch('http://localhost:5000/daycares');
            const data = await response.json();
            setDaycares(data);
        };
        fetchDaycares();
    }, []);

    return (
        <div>
            <h2>Available Daycares</h2>
            <ul>
                {daycares.length > 0 ? (
                    daycares.map(daycare => (
                        <li key={daycare.id}>
                            <h3>{daycare.name}</h3>
                            <p>{daycare.address}</p>
                        </li>
                    ))
                ) : (
                    <p>No daycares available.</p>
                )}
            </ul>
        </div>
    );
};

export default DaycareList;
