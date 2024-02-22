import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';

const AR = () => {
    useEffect(() => {
        // Function to handle marker found and lost
        const handleMarkerEvents = (marker, camera) => {
            let check; // Interval ID for distance checks

            const markerFound = () => {
                check = setInterval(() => {
                    const cameraPosition = camera.object3D.position;
                    const markerPosition = marker.object3D.position;
                    const distance = cameraPosition.distanceTo(markerPosition);

                    console.log(distance);
                }, 100);
            };

            const markerLost = () => {
                clearInterval(check);
            };

            // Add event listeners
            marker.addEventListener('markerFound', markerFound);
            marker.addEventListener('markerLost', markerLost);

            // Cleanup function for these listeners
            return () => {
                marker.removeEventListener('markerFound', markerFound);
                marker.removeEventListener('markerLost', markerLost);
                clearInterval(check);
            };
        };

        // Ensure the scene is loaded before adding event listeners
        const sceneEl = document.querySelector('a-scene');
        if (sceneEl) {
            sceneEl.addEventListener('loaded', () => {
                const camera = document.querySelector('[camera]');
                const marker = document.querySelector('a-marker');
                if (marker && camera) {
                    // Call the function and get back the cleanup function
                    const cleanup = handleMarkerEvents(marker, camera);

                    // Cleanup listeners when component unmounts
                    return cleanup;
                }
            });
        }
    }, []);
    return (
        <>
            <NavLink to="/home">Home</NavLink>
            <a-scene arjs='sourceType: webcam; debugUIEnabled: false'>
                <a-marker preset="hiro">
                    <a-entity gltf-model="https://ahmedmansour3548.github.io/MRInteractiveWallPage/scene.gltf"
                        position="0.5 1 1"
                        scale="0.02 0.02 0.02"
                        animation-mixer="clip: *; loop: repeat; timeScale: 1;">
                    </a-entity>
                    {/* Original Red Box - Shrinking and Growing */}
                    <a-box position='0 1 0' scale='0.2 0.2 0.2' material='color: red; opacity: 1;'
                        animation="property: scale; to: 0.5 0.5 0.5; dir: alternate; dur: 2000; easing: easeInOutQuad; loop: true">
                    </a-box>
                    {/* Blue Box - Rotating */}
                    <a-box position='-1 1.5 0' scale='0.1 0.1 0.1' material='color: blue; opacity: 0.8;'
                        animation="property: rotation; to: 0 360 0; loop: true; dur: 4000; easing: linear">
                    </a-box>
                    {/* Green Box - Moving Up and Down */}
                    <a-box position='1.2 1.6 0' scale='0.15 0.15 0.15' material='color: green; opacity: 0.6;'
                        animation="property: position; to: 0.2 0.4 0; dir: alternate; dur: 3000; easing: easeInOutSine; loop: true">
                    </a-box>
                    {/* Yellow Box - Fading In and Out */}
                    <a-box position='0 2.5 -0.2' scale='0.12 0.12 0.12' material='color: yellow; opacity: 1;'
                        animation="property: material.opacity; from: 1; to: 0.1; dir: alternate; dur: 5000; easing: easeInOutQuad; loop: true">
                    </a-box>
                    {/* Purple Box - Spinning and Moving Forward and Backward */}
                    <a-box position='0 1.7 0' scale='0.2 0.05 0.05' material='color: purple; opacity: 0.9;'
                        animation="property: rotation; to: 0 0 360; loop: true; dur: 2000; easing: linear"
                        animation__pos="property: position; to: 0 0.4 0.3; dir: alternate; dur: 4500; easing: easeInOutSine; loop: true">
                    </a-box>
                </a-marker>
                <a-entity camera></a-entity>
            </a-scene>
        </>
    );
};

export default AR;
