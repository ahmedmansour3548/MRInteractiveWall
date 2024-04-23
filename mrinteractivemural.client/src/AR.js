/**
 * A custom React hook that manages the state and behavior for the AR component.
 * This module contains the logic part of the AR system, separated from the React components.
 * 
 * 
 * @module ARLogic
 */

import { useState, useEffect } from 'react';

/**
 * Hook that manages the AR scene's state and interactions.
 * 
 * @returns {Object} The visibility state of the AR scene, and functions to toggle this state and handle button clicks for model swapping.
 */
export const AR = () => {
    const [isSceneVisible, setIsSceneVisible] = useState(true);
    const [modelPath, setModelPath] = useState("");
    const [modelsCount, setModelsCount] = useState(0);
    const [currentModelIndex, setCurrentModelIndex] = useState(1);
    const [currentModelId, setCurrentModelId] = useState(1);

    useEffect(() => {
        // Fetch the total number of models
        fetch('https://localhost:7121/api/models')
            .then((response) => response.json())
            .then((data) => {
                console.log("Number of models in database: " + data.length);
                setModelsCount(data.length);
            })
            .catch((error) => console.error('Error fetching models count:', error));
    }, []);

    /**
     * Toggles the visibility state of the AR scene.
     */
    const toggleSceneVisibility = () => {
        setIsSceneVisible((prevState) => !prevState);
    };

    const handleSwapButtonClick = () => {
        loadModel(currentModelIndex + 1);
    };

    const updateModelPath = (newModelPath) => {
        setModelPath(newModelPath);
    };

    /**
     * Fetches and loads the model based on the provided model ID.
     */
    function loadModelById (id) {
        const apiUrl = `https://localhost:7121/api/getGitHubModel?folderName=2`;
        fetch(apiUrl)
            .then((response) => response.json())
            .then((data) => {
                console.log(data.modelFileName);

                // Set the model path using setModelPath
                setModelPath(data.modelUrl);
            })
            .catch((error) => console.error('Error loading the model:', error));
    };

    function loadModel() {
        const apiUrl = `https://localhost:7121/api/getGitHubModel?folderName=1`;

        fetch(apiUrl)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);

                // Set the gltf-model path
                setModelPath(data.modelUrl);

                // Update text
                setCurrentModelId(currentModelIndex + 1);

                // Loop counter back to 0
                setCurrentModelIndex((prevIndex) => {
                    return (prevIndex + 1) % modelsCount;
                });
            })
            .catch((error) => console.error('Error loading the model:', error));
    }

    return { isSceneVisible, toggleSceneVisibility, handleSwapButtonClick, modelPath, currentModelId };
};
