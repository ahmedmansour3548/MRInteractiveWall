/**
 * @file This file defines the Drawer hook used for toggling the visibility of a UI drawer.
 */

import { useState } from 'react';

/**
 * A custom React hook to manage the state of a drawer component.
 * It provides functionality to toggle the open/close state of the drawer.
 * 
 * @returns {{isDrawerOpen: boolean, toggleDrawer: Function}} An object containing:
 * - `isDrawerOpen`: A boolean state indicating whether the drawer is open.
 * - `toggleDrawer`: A function that toggles the state of `isDrawerOpen`.
 */
export const Drawer = () => {
    // State to keep track of the drawer's open/close status.
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    /**
     * Toggles the open/close state of the drawer.
     */
    const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

    // Exposing the state and the toggler function for external use.
    return { isDrawerOpen, toggleDrawer };
};
