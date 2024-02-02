import { NavLink } from 'react-router-dom';

const AR = () => {
    return (
        <>
            <NavLink to="/home">
                Home
            </NavLink>
            <a-scene vr-mode-ui='enabled: false' arjs='sourceType: webcam; videoTexture: true; debugUIEnabled: false' renderer='antialias: true; alpha: true'>
                <a-camera gps-new-camera='gpsMinDistance: 5'></a-camera>
                <a-entity material='color: red' geometry='primitive: box' gps-new-entity-place="latitude: 28.5944762; longitude: -81.2844757" scale="10 10 10"></a-entity>
            </a-scene>
        </>
    );
};

export default AR;
