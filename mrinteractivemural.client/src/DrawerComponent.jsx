import React, { useState } from 'react';

const DrawerComponent = () => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleDrawer = () => setIsOpen(!isOpen);

    const drawerStyle = {
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s ease-in-out',
        position: 'fixed',
        left: 0,
        top: 0,
        width: '250px',
        height: '100%',
        background: '#fff',
        boxShadow: '2px 0 5px rgba(0,0,0,0.5)',
        padding: '20px',
    };

    return (
        <>
            <button onClick={toggleDrawer}>{isOpen ? 'Close' : 'Info'}</button>
            <div style={drawerStyle}>
                <p>Some info text here...</p>
            </div>
        </>
    );
};

export default DrawerComponent;
