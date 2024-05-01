import { NavLink } from 'react-router-dom';
import { AR } from './AR';
import './AR.css';


/**
 * this is MyClass.
 */
const ARComponent = () => {

    const { isSceneVisible, toggleSceneVisibility, handleSwapButtonClick, modelPath, currentModelId, filesLinks } = AR();


    return (
        <>
            <div className="buttonsContainer">
                <div className="homeButtonContainer">
                    <NavLink className="homeNavLink" to="/" >Return Home</NavLink>
                </div>


            </div>

            {isSceneVisible && (
                <a-scene gesture-detector arjs='sourceType: webcam; patternRatio: 0.50; trackingMethod: best; maxDetectionRate: 60 detectionMode: mono_and_matrix; matrixCodeType: 4x4_BCH_13_5_5; debugUIEnabled: true;' click-listener>
                    {/*<a-scene embedded gesture-detector arjs='sourceType: webcam; patternRatio: 0.75 trackingMethod: best maxDetectionRate: 60 detectionMode: mono_and_matrix; matrixCodeType: 4x4_BCH_13_5_5;' renderer='antialias: true; alpha: true; precision: medium;' vr-mode-ui="enabled: false" stats click-listener>*/}
                    {/* Asset Manager */}
                    <a-assets>
                        <a-asset-item id="#Number1" src="horse.obj"></a-asset-item>
                        {/* Mixins allow the definition of reusable properties that can be used to easily add effects across objects */ }
                        <a-mixin id="giant" scale="5 5 5"></a-mixin>
                    </a-assets>

                    {console.log(filesLinks)}
                    {
                        filesLinks.map((fileLink, index) => (

                            <a-marker key={index} type="pattern" preset="custom" url={fileLink.pattern} id="button" name={index}>
                                <a-box id="button" name={index} emitevents="true" data-raycastable position='0 0 -0.2' scale='1.5 1.5 0.2' material='color: red; opacity: 0.3;'></a-box>
                            </a-marker>
                        ))}

                    {/* Center Marker */}
                    <a-marker type="pattern" preset="hiro" id="centerMarker">
                        <a-image id="centerLeft" position="-0.25 0 0" scale="0.5 1 1" width="1" height="1" src="/src/assets/logo/logoLeft.png" debug-raycaster></a-image>
                        <a-image id="centerRight" position="0.25 0 0" scale="0.5 1 1" width="1" height="1" src="/src/assets/logo/logoRight.png" debug-raycaster></a-image>
                        <a-entity id="centerEntity" data-raycastable position="0 0 -1" scale="0.2 0.2 0.2" />
                        {/* Floating info text box */}
                        <a-plane id="labMemberInfoPlane" position="2 -1 1" material='color: #555555; opacity: 0.2;' scale="2 2 2" visible="false">
                            <a-text id="labMemberInfo" value="" color="white" width="2" align="center" wrapCount="15" font="https://cdn.aframe.io/fonts/Roboto-msdf.json"></a-text>
                        </a-plane>
                        {/* Virtual Room*/}
                        <a-box id="animated-model" name="virtualroom" data-raycastable position='0 0 -0.2' scale='1 1 0.2' material='color: black; opacity: 1;'></a-box>
                    </a-marker>

                    {/* Marker for lab Member 1
                    <a-marker type="pattern" preset="custom" url="/src/assets/numbers/001.patt" id="interactable-marker">
                        <a-plane id="model-wrapper" cursor="rayOrigin: mouse" emitevents="true" data-raycastable name="triangle" position="0 0 0" scale="3 3 3"
                            material="opacity: 1;" debug-raycaster>
                            <a-entity id="dynamic-model" data-raycastable gltf-model="/src/assets/triangle/triangle.gltf"
                                position="0 0 0.1"
                                scale="0.2 0.2 0.2"
                                animation-mixer="clip: animation0; loop: repeat">
                            </a-entity>
                        </a-plane>
                    </a-marker>
                    <a-marker type="pattern" preset="custom" url="/src/assets/numbers/003.patt" id="interactable-marker">
                        <a-plane id="model-wrapper" cursor="rayOrigin: mouse" emitevents="true" data-raycastable name="bluebox" position="0 0 0" scale="3 3 3"
                            material="opacity: 1;" debug-raycaster>
                            <a-box id="animated-model" data-raycastable position='0 0 0.2' scale='0.1 0.1 0.1' material='color: blue; opacity: 0.8;'
                                animation="property: rotation; to: 0 360 0; loop: true; dur: 4000; easing: linear">
                            </a-box>
                        </a-plane>
                    </a-marker>
                    <a-marker type="barcode" value="3" id="interactable-marker">
                        <a-plane id="model-wrapper" cursor="rayOrigin: mouse" emitevents="true" data-raycastable name="redbox" position="0 0 0" scale="3 3 3"
                            material="opacity: 1;" debug-raycaster>
                            <a-box id="animated-model" name="redbox" data-raycastable class="interactive-entity" position='0 0 0.2' scale='0.2 0.2 0.2' material='color: red; opacity: 1;'
                                animation="property: scale; to: 0.3 0.3 0.3; dir: alternate; dur: 2000; easing: easeInOutQuad; loop: true">
                            </a-box>
                        </a-plane>
                    </a-marker>
                     */}
                    {/*</a-entity>
                        <a-entity id="animated-model" name="triangle" data-raycastable gltf-model="/src/assets/triangle/triangle.gltf"
                        position="-0.5 1 1"
                        scale="0.2 0.2 0.2"
                            animation-mixer="clip: *; loop: repeat; timeScale: 1;">
                            
                        </a-entity>
                        <a-plane id="animated-model" data-raycastable name="triangleinvisible" position="-0.5 1 1" scale="1 1 1"
                            material="opacity: 0.5; transparent: true"
           
                        ></a-plane>
                        <a-entity id="animated-model" name="robot" data-raycastable gltf-model="/src/assets/robot/robot.glb"
                        position="-0.5 0.5 1"
                        scale="0.2 0.2 0.2"
                        animation-mixer="clip: *; loop: repeat; timeScale: 1;">
                    </a-entity>
                    */}{/* Red Box */}{/*
                        <a-box id="animated-model" name="redbox" data-raycastable class="interactive-entity" position='0 -0.5 0' scale='0.2 0.2 0.2' material='color: red; opacity: 1;'
                        animation="property: scale; to: 0.5 0.5 0.5; dir: alternate; dur: 2000; easing: easeInOutQuad; loop: true">
                    </a-box>
                    */}{/* Blue Box */}{/*
                        <a-box id="animated-model" name="bluebox" data-raycastable position='0 0 0.5' scale='0.1 0.1 0.1' material='color: blue; opacity: 0.8;'
                        animation="property: rotation; to: 0 360 0; loop: true; dur: 4000; easing: linear">
                    </a-box>
                    */}{/* Green Box */}{/*
                        <a-box id="animated-model" name="greenbox" data-raycastable position='0 0 0' scale='0.15 0.15 0.15' material='color: green; opacity: 0.6;'
                        animation="property: position; to: 0.2 0.4 0; dir: alternate; dur: 3000; easing: easeInOutSine; loop: true">
                    </a-box>
                    */}{/* Yellow Box */}{/*
                        <a-box id="animated-model" name="yellowbox" data-raycastable position='0.6 -0.3 -0.6' scale='0.12 0.12 0.12' material='color: yellow; opacity: 1;'
                        animation="property: material.opacity; from: 1; to: 0.1; dir: alternate; dur: 5000; easing: easeInOutQuad; loop: true">
                    </a-box>
                    */}{/* Purple Box */}{/*
                        <a-box id="animated-model" name="purplebox" data-raycastable position='0.9 0 0' scale='0.2 0.05 0.05' material='color: purple; opacity: 0.9;'
                        animation="property: rotation; to: 0 0 360; loop: true; dur: 2000; easing: linear"
                        animation__pos="property: position; to: 0 0.4 0.3; dir: alternate; dur: 4500; easing: easeInOutSine; loop: true">
                    </a-box>*/}
                    <a-entity camera></a-entity>

                    <a-camera
                        id="camera"
                        look-controls="enabled: false"
                        position="0 0 0"
                        raycaster="objects: .clickable"
                        cursor="fuse: false;
                            rayOrigin: mouse;">
                    </a-camera>
                </a-scene>
            )}
        </>
    );
};

export default ARComponent;
