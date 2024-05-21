import { NavLink } from 'react-router-dom';
import { AR } from './AR';
import './AR.css';

/**
 * ARComponent represents the main page where the AR experience takes place.
 */
const ARComponent = () => {
    const {
        isSceneVisible,
        filesLinks,
    } = AR();

    return (
        <>
            <div className="buttonsContainer">
                <div className="homeButtonContainer">
                    <NavLink className="homeNavLink" to="/">
                        Return Home
                    </NavLink>
                </div>
            </div>

            {isSceneVisible && (
                <a-scene vr-mode-ui="enabled: false" embedded arjs='sourceType: webcam; sourceWidth:1280; sourceHeight:960; displayWidth: 1280; displayHeight: 960; matrixCodeType: 4x4_BCH_13_5_5; debugUIEnabled: false;'>
                    <a-marker preset="hiro">
                        <a-plane id="button" class="clickable" emitevents="true" rotation=" -90 0 0" position='0 0 -0.2' scale='1.5 1.5 0.2' material='color: red; opacity: 0.3;'></a-plane>
                    </a-marker>
                    <a-camera position="0 0 0" cursor="fuse: false;rayOrigin:mouse;" raycaster="objects:.clickable" look-controls="enabled: false" cursor-listener>
                        {/*<a-entity cursor="fuse: false;rayOrigin:mouse;" raycaster="objects:a-box" position="0 0 -1" geometry="primitive: ring; radiusInner: 0.02; radiusOuter: 0.03" material="color: black; shader: flat">
                        </a-entity>*/}
                    </a-camera>
                </a-scene>
            )}
        </>
    );
};

export default ARComponent;