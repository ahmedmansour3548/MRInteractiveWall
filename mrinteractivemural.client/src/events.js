import { AR } from './AR.js';

// Register a custom component to handle click events and model/door animations
AFRAME.registerComponent('click-listener', {
    init: function () {
        
        this.camera = this.el.sceneEl.camera;
        // Use an arrow function to bind the onClick function to this component instance and listen for click events on the scene
        this.onClick = (evt) => this.castRay({ x: evt.clientX, y: evt.clientY });
        this.el.sceneEl.addEventListener('click', this.onClick);
        this.currentClipIndex = 0;
        // Prepare a new THREE.Raycaster
        this.raycaster = new THREE.Raycaster();

        this.camera.updateMatrixWorld();

        // Get references to the center marker/planes to manipulate them easily
        this.imageLeft = this.el.sceneEl.querySelector('#centerLeft');
        this.imageRight = this.el.sceneEl.querySelector('#centerRight');
        this.centerEntity = this.el.sceneEl.querySelector('#centerEntity');
        this.labMemberInfo = this.el.sceneEl.querySelector('#labMemberInfo');
        this.labMemberInfoPlane = this.el.sceneEl.querySelector('#labMemberInfoPlane');
        this.doorsOpen = false;
        this.modelURL = null;
        this.openDoors = (speed, endPoint) => {
            const positionLeft = this.imageLeft.getAttribute('position');
            const positionRight = this.imageRight.getAttribute('position');
            const animate = () => {
                // Update the position
                positionLeft.x -= speed;
                positionRight.x += speed;
                this.imageLeft.setAttribute('position', positionLeft);
                this.imageRight.setAttribute('position', positionRight);

                // Check if the animation should continue
                if (positionRight.x < endPoint) {
                    // Continue the animation
                    requestAnimationFrame(animate);
                }
                else {
                    this.doorsOpen = true;
                }
            };
            // Start the animation
            animate();
        };

        this.closeDoors = (speed) => {
            const positionLeft = this.imageLeft.getAttribute('position');
            const positionRight = this.imageRight.getAttribute('position');
            const animate = () => {
                // Update the position
                positionLeft.x += speed;
                positionRight.x -= speed;
                this.imageLeft.setAttribute('position', positionLeft);
                this.imageRight.setAttribute('position', positionRight);
                // Check if the animation should continue
                if (positionRight.x > 0.25) {
                    // Continue the animation
                    requestAnimationFrame(animate);
                }
                else {
                    this.doorsOpen = false;
                }
            };
            // Start the animation
            animate();
        };

        this.slideImageRight = (img, speed, endPoint) => {
            const position = img.getAttribute('position');
            const animate = () => {
                // Update the position
                position.x += speed;
                img.setAttribute('position', position);

                // Check if the animation should continue
                if (position.x < endPoint) {
                    // Continue the animation
                    requestAnimationFrame(animate);
                }
            };
            // Start the animation
            animate();
        };

        this.displayModel = (speed, endPoint) => {
            const position = this.centerEntity.getAttribute('position');
            const animate = () => {
                // Update the position
                position.z += speed;
                this.centerEntity.setAttribute('position', position);
                // Check if the animation should continue
                if (position.z < endPoint) {
                    // Continue the animation
                    requestAnimationFrame(animate);
                }
            };
            // Start the animation
            animate();
        };

        this.hideModel = (speed, endPoint) => {
            const position = this.centerEntity.getAttribute('position');
            const animate = () => {
                // Update the position
                position.z -= speed;
                this.centerEntity.setAttribute('position', position);
                // Check if the animation should continue
                if (position.z > endPoint) {
                    // Continue the animation
                    requestAnimationFrame(animate);
                }
                else {
                    console.log("model animation done, closing door");
                    this.closeDoors(0.001);
                }
            };
            // Start the animation
            animate();
        };
    },

    remove: function () {
        // Clean up by removing the event listener if the component is removed
        this.el.sceneEl.removeEventListener('click', this.onClick);
    },

    onClick: function (evt) {
        // Get the click position from the event
        const clickPosition = { x: evt.clientX, y: evt.clientY };
        console.log("yeet");
        this.castRay(clickPosition);
    },

    castRay: function (clickPosition) {
        this.camera.lookAt(this.el.sceneEl.object3D.position);

        // Convert the click position to normalized device coordinates (NDC)
        const x = (clickPosition.x / window.innerWidth) * 2 - 1;
        const y = -(clickPosition.y / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(new THREE.Vector2(x, y), this.camera);

        // Perform the raycast
        const intersects = this.raycaster.intersectObjects(this.el.sceneEl.object3D.children, true);

        if (intersects.length > 0) {
            const firstIntersection = intersects[0].object.el; // Get the A-Frame element of the intersected object
            if (firstIntersection.matches('#button')) {
                const markerID = parseInt(firstIntersection.getAttribute('name')) + 1;
                console.log('Intersected with a button!!' + firstIntersection.getAttribute('id'));
                if (!this.doorsOpen) {
                    console.log("opening doors!");
                    this.openDoorsAndDisplayModel(markerID);
                } else {
                    console.log("closing doors and hiding model!");
                    this.hideModelAndCloseDoors();
                }
            }
        }
    },

    openDoorsAndDisplayModel: function (markerID) {
        this.openDoors(0.005, 0.5);
        setTimeout(() => {
            // Based on the button, get the ID of the marker and set the gltf attribute of the center marker to the model
            if (markerID) {
                console.log("markerID: " + markerID);
                console.log(this.centerEntity.getAttribute("position"));
                // Fetch the model and JSON file URLs
                fetch(`https://localhost:7121/api/getGitHubModel?folderName=${markerID}`)
                    .then((response) => response.json())
                    .then((data) => {
                        this.modelUrl = data.modelUrl;
                        const jsonUrl = data.jsonUrl;

                        // Fetch the JSON parameter file
                        fetch(jsonUrl)
                            .then((response) => response.json())
                            .then((jsonData) => {
                                console.log(jsonData);
                                var infoText = jsonData.member.labID + "\n\n\n" + jsonData.member.name + "\n\n" + jsonData.member.role + "\n" + jsonData.member.note;

                                if (jsonData.model) {
                                    // Apply custom model parameters
                                    const modelParams = {
                                        scale: "scale",
                                        position: "position",
                                        rotation: "rotation",
                                        color: "color",
                                        opacity: "opacity",
                                        visible: "visible",
                                        castShadow: "cast-shadow",
                                        receiveShadow: "receive-shadow"
                                    };

                                    for (const [key, attr] of Object.entries(modelParams)) {
                                        if (jsonData.model[key]) {
                                            console.log(`Setting ${attr}!`);
                                            this.centerEntity.setAttribute(attr, jsonData.model[key]);
                                        } else {
                                            // Set default values
                                            switch (attr) {
                                                case "scale":
                                                    this.centerEntity.setAttribute(attr, "0.2 0.2 0.2");
                                                    break;
                                                case "position":
                                                    this.centerEntity.setAttribute(attr, "0 0 -1");
                                                    break;
                                                case "rotation":
                                                    this.centerEntity.setAttribute(attr, "0 0 0");
                                                    break;
                                                case "color":
                                                    this.centerEntity.setAttribute(attr, "#ffffff");
                                                    break;
                                                case "opacity":
                                                    this.centerEntity.setAttribute(attr, "1");
                                                    break;
                                                case "visible":
                                                    this.centerEntity.setAttribute(attr, "true");
                                                    break;
                                                case "cast-shadow":
                                                    this.centerEntity.setAttribute(attr, "true");
                                                    break;
                                                case "receive-shadow":
                                                    this.centerEntity.setAttribute(attr, "true");
                                                    break;
                                            }
                                        }
                                    }
                                }

                                // Set the gltf-model attribute of the center entity to the model URL
                                this.centerEntity.setAttribute("gltf-model", this.modelUrl);

                                // Check for animations in the loaded model
                                this.centerEntity.addEventListener('model-loaded', () => {
                                    const model = this.centerEntity.getObject3D('mesh');
                                    if (model && model.animations && model.animations.length > 0) {
                                        console.log('Model has animations:', model.animations);

                                        // Create a mixer to play the animations
                                        this.mixer = new THREE.AnimationMixer(model);
                                        this.clips = model.animations;

                                        // Play the first animation by default
                                        this.currentClip = this.mixer.clipAction(this.clips[0]);
                                        this.currentClip.play();

                                        // Update the animation on each frame
                                        this.tick = (time, deltaTime) => {
                                            if (this.mixer) {
                                                this.mixer.update(deltaTime / 1000);
                                            }
                                        };
                                        this.el.sceneEl.addBehavior(this);
                                    }
                                });

                                // Set the plane behind text to be visible
                                this.labMemberInfoPlane.setAttribute("visible", true);

                                // Set the value of the text attribute to the extracted information
                                this.labMemberInfo.setAttribute("value", infoText);
                            })
                            .catch((error) => console.error('Error fetching JSON file:', error));
                    })
                    .catch((error) => console.error('Error fetching model URL:', error));
            }
            this.displayModel(0.005, 1);
        }, 1000); // Delay displayModel for 1 second
    },

    hideModelAndCloseDoors: function () {
        this.hideModel(0.005, -1);
        setTimeout(() => {
            this.closeDoors(0.005);
        }, 5000); // Delay closing doors for 5 seconds
    },
});

// Register a debug component to log raycaster intersections
AFRAME.registerComponent('debug-raycaster', {
    init: function () {
        this.el.addEventListener('raycaster-intersected', evt => {
            console.log('Raycaster has intersected:', evt.detail.el);
        });
        this.el.addEventListener('raycaster-intersected-cleared', evt => {
            console.log('Raycaster intersection cleared:', evt.detail.el);
        });
    }
});