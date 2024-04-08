import { useCallback, useState, useEffect } from 'react';
import { Drawer } from './Drawer';

/**
 * A custom React hook that manages the state and behavior for the Home component.
 * It handles navigation, interaction, and the background effects.
 * 
 * @returns {Object} The state values and functions neccessary to interface with {@link HomeComponent}.
 */
export const Home = () => {
    /**
     * State to manage the state of the drawer component.
     */
    const { isDrawerOpen, toggleDrawer } = Drawer();

    /**
     * State to manage the viewport size for background effects.
     */
    const [viewportSize, setViewportSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    /**
     * A memoized callback that calculates the number of squares based on the current viewport size.
     * It divides the viewport into a grid of squares, each with a side length defined by `squareSize`.
     * 
     * @returns {Array<Object>} An array of objects where each object represents a unique square with a random color.
     */
    const calculateSquares = useCallback(() => {
        const squareSize = 20;
        const widthSquares = Math.floor(window.innerWidth / squareSize);
        const heightSquares = Math.floor(window.innerHeight / squareSize);
        const numSquares = widthSquares * heightSquares;

        return Array.from({ length: numSquares }, (_, i) => ({
            id: i,
            color: `hsl(${Math.random() * 360}, 100%, 50%)`,
        }));
    }, []);

    /**
     * An effect that listens for window resize events to update the `viewportSize` state,
     * ensuring that the grid of squares is recalculated and rendered correctly for the new viewport size.
     */
    useEffect(() => {
        const handleResize = () => {
            setViewportSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    /**
     * State to store the calculated squares. It is initially populated by calling `calculateSquares`.
     */
    const [squares, setSquares] = useState(calculateSquares());

    /**
     * An effect that recalculates the squares any time the viewport size changes.
     */
    useEffect(() => {
        setSquares(calculateSquares());
    }, [viewportSize, calculateSquares]);

    /**
     * An effect that periodically updates the color of each square to create a dynamic, animated pattern.
     * It uses a 1-second interval to randomly assign new colors to all squares.
     */
    useEffect(() => {
        console.log("adjusting colors");
        const intervalId = setInterval(() => {
            setSquares((squares) =>
                squares.map((square) => ({
                    ...square,
                    color: `hsl(${Math.random() * 360}, 100%, 50%)`,
                }))
            );
        }, 1000);

        return () => clearInterval(intervalId);
    }, [calculateSquares]);

    return { squares, isDrawerOpen, toggleDrawer };
};
