import { NavLink } from 'react-router-dom';
import { AR } from './AR';
import './AR.css';


/**
 * The main AR component, responsible for displaying the AR content using AR.JS
 * 
 * @returns the page HTML
 */
const ARComponent = () => {

    const { isSceneVisible, toggleSceneVisibility, handleSwapButtonClick, modelPath, currentModelId } = AR();


    return (
        <>
            <div className="buttonsContainer">
                <div className="swapModelButtonContainer">
                    <button className="swapModelButton" onClick={handleSwapButtonClick}>Swap Model</button>
                </div>
                <div className="homeButtonContainer">
                    <NavLink className="homeNavLink" to="/" >Return Home</NavLink>
                </div>
                
                
            </div>

            {isSceneVisible && (
                <a-scene gesture-detector arjs='sourceType: webcam; detectionMode: mono_and_matrix; matrixCodeType: 4x4_BCH_13_5_5; debugUIEnabled: true;' click-listener>
                    <a-marker type="pattern" preset="hiro" id="interactable-marker">
                        <a-entity data-raycastable gltf-model={modelPath}
                            position="0 0 0.5"
                            scale="0.2 0.2 0.2"
                            animation-mixer="clip: idle; loop: repeat">
                        </a-entity>
                    </a-marker>
                    <a-marker type="pattern" preset="custom" url="/src/assets/numbers/001.patt" id="interactable-marker">
                        <a-box id="button" name="1" data-raycastable position='0 0 0.2' scale='1 1 0.2' material='color: blue; opacity: 0.9;' />
                        <a-plane id="plane" name="1" data-raycastable position="0 0 0" scale="2 2 2" material="opacity: 0; transparent: true" />
                    </a-marker>
                    <a-marker type="pattern" preset="custom" url="/src/assets/numbers/002.patt" id="interactable-marker">
                        <a-box id="button" name="2" data-raycastable position='0 0 0.2' scale='1 1 0.2' material='color: blue; opacity: 0.9;' />
                        <a-plane id="plane" name="2" data-raycastable position="0 0 0" scale="2 2 2" material="opacity: 0; transparent: true" />
                    </a-marker>
                    <a-marker type="pattern" preset="custom" url="/src/assets/numbers/003.patt" id="3">
                        <a-box id="button" name="3"  data-raycastable position='0 0 0.2' scale='1 1 0.2' material='color: blue; opacity: 0.9;'/>
                        <a-plane id="plane" name="3" data-raycastable position="0 0 0" scale="2 2 2" material="opacity: 0; transparent: true"/>
                    </a-marker>
                    <a-marker type="pattern" preset="custom" url="/src/assets/numbers/003.patt" id="4">
                        <a-box id="button" name="4" data-raycastable position='0 0 0.2' scale='1 1 0.2' material='color: blue; opacity: 0.9;' />
                        <a-plane id="plane" name="4" data-raycastable position="0 0 0" scale="2 2 2" material="opacity: 0; transparent: true" />
                    </a-marker>
                    {/*<a-marker type="barcode" value="3" id="interactable-marker">
                            <a-box id="animated-model" name="redbox" data-raycastable class="interactive-entity" position='0 0 0.2' scale='0.2 0.2 0.2' material='color: red; opacity: 1;'
                                animation="property: scale; to: 0.3 0.3 0.3; dir: alternate; dur: 2000; easing: easeInOutQuad; loop: true">
                            </a-box>
                    </a-marker>
                    </a-entity>
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
