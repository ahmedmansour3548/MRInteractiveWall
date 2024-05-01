// HomeComponent.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home } from './Home'; // Adjust the path as necessary
import './Home.css';

const HomeComponent = () => {
    const { squares, isDrawerOpen, toggleDrawer } = Home();
    
    return (
        <>
            <div className={`patternGrid ${isDrawerOpen ? 'darken' : ''}`}>
                {squares.map(square => (
                    <div
                        key={square.id}
                        className="square"
                        style={{ backgroundColor: square.color }}
                    ></div>
                ))}
            </div>
            <div className="content">
                <div className="navLinkContainer">
                    <img src="/images/VARLAB_Logo.png" alt="VARLAB Logo" />
                    <NavLink to="/ar" className="navLink">Start Augmented Reality Experience</NavLink>
                    <button onClick={toggleDrawer} className="toggleDrawerButton">About</button>
                </div>
                {isDrawerOpen && (
                    <div className="backdrop" onClick={toggleDrawer}>
                        <div className="drawerContainer" onClick={(e) => e.stopPropagation()}>
                            <h1>Credits</h1>
                            <p>Created by: Ahmed Mansour & Ryan Kendrick</p>
                            <p></p>
                            <p>For CAP6117: Ryan McMahan</p>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default HomeComponent;
