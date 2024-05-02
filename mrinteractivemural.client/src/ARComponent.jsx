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
                <a-scene
                    gesture-detector
                    arjs="sourceType: webcam; patternRatio: 0.50; trackingMethod: best; maxDetectionRate: 60 detectionMode: mono_and_matrix; matrixCodeType: 4x4_BCH_13_5_5; debugUIEnabled: true;"
                    click-listener
                >
                    {/* Asset Manager */}
                    <a-assets>
                        <a-asset-item id="#Number1" src="horse.obj"></a-asset-item>
                        {/* Mixins allow the definition of reusable properties that can be used to easily add effects across objects */}
                        <a-mixin id="giant" scale="5 5 5"></a-mixin>
                    </a-assets>

                    {console.log(filesLinks)}
                    {filesLinks.map((fileLink, index) => (
                        <a-marker
                            key={index}
                            type="pattern"
                            preset="custom"
                            url={fileLink.pattern}
                            id="button"
                            name={index}
                        >
                            <a-box
                                id="button"
                                name={index}
                                emitevents="true"
                                data-raycastable
                                position="0 0 -0.2"
                                scale="1.5 1.5 0.2"
                                material="color: red; opacity: 0.3;"
                            ></a-box>
                        </a-marker>
                    ))}

                    {/* Center Marker */}
                    <a-marker type="pattern" preset="hiro" id="centerMarker">
                        <a-image
                            id="centerLeft"
                            position="-0.25 0 0"
                            scale="0.5 1 1"
                            width="1"
                            height="1"
                            src="/src/assets/logo/logoLeft.png"
                            debug-raycaster
                        ></a-image>
                        <a-image
                            id="centerRight"
                            position="0.25 0 0"
                            scale="0.5 1 1"
                            width="1"
                            height="1"
                            src="/src/assets/logo/logoRight.png"
                            debug-raycaster
                        ></a-image>
                        <a-entity
                            id="centerEntity"
                            data-raycastable
                            position="0 0 -1"
                            scale="0.2 0.2 0.2"
                        />
                        {/* Floating info text box */}
                        <a-plane
                            id="labMemberInfoPlane"
                            position="2 -1 1"
                            material="color: #555555; opacity: 0.2;"
                            scale="2 2 2"
                            visible="false"
                        >
                            <a-text
                                id="labMemberInfo"
                                value=""
                                color="white"
                                width="2"
                                align="center"
                                wrapCount="15"
                                font="https://cdn.aframe.io/fonts/Roboto-msdf.json"
                            ></a-text>
                        </a-plane>
                        {/* Virtual Room */}
                        <a-box
                            id="animated-model"
                            name="virtualroom"
                            data-raycastable
                            position="0 0 -0.2"
                            scale="1 1 0.2"
                            material="color: black; opacity: 1;"
                        ></a-box>
                    </a-marker>

                    <a-entity camera></a-entity>

                    <a-camera
                        id="camera"
                        look-controls="enabled: false"
                        position="0 0 0"
                        raycaster="objects: .clickable"
                        cursor="fuse: false; rayOrigin: mouse;"
                    ></a-camera>
                </a-scene>
            )}
        </>
    );
};

export default ARComponent;