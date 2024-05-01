import { AR } from './AR.js';

/*AFRAME.registerComponent('markerhandler', {
    init: function () {
        // Initialize clipNames here instead of in the schema to ensure it's always defined.
        this.clipNames = ['idle', 'hiphop', 'chicken', 'pockets'];
        this.currentClipIndex = 0;

        this.el.addEventListener('model-loaded', () => {
            const planeEl = this.el.querySelector('#model-wrapper');
            if (planeEl) {
                planeEl.addEventListener('click', () => {
                    const targetEl = planeEl.querySelector('[gltf-model]');
                    if (targetEl) {
                        // Use this.clipNames and this.currentClipIndex here
                        this.currentClipIndex = (this.currentClipIndex + 1) % this.clipNames.length;
                        const clipName = this.clipNames[this.currentClipIndex];

                        // Assuming animation-mixer component is properly attached to the entity
                        if (targetEl.components['animation-mixer']) {
                            console.log("Animation mixer exists!");
                            targetEl.setAttribute('animation-mixer', `clip: ${clipName}; loop: repeat; crossFadeDuration: 0.4`);
                            console.log(`Playing animation clip: ${clipName}`);
                        } else {
                            console.log("Animation mixer doesn't exist!");
                        }
                    }
                });
            }
        });
    }
});*/
AFRAME.registerComponent('click-listener', {
    init: function () {
        this.camera = this.el.sceneEl.camera;
        // Bind the onClick function to this component instance and listen for click events on the scene
        this.onClick = this.onClick.bind(this);
        this.el.sceneEl.addEventListener('click', this.onClick);
        this.currentClipIndex = 0;
        // Prepare a new THREE.Raycaster
        this.raycaster = new THREE.Raycaster();

        this.camera.updateMatrixWorld();

        // TODO: get reference to center marker/planes to manipulate them easier
        this.imageLeft = this.el.sceneEl.querySelector('#centerLeft');
        this.imageRight = this.el.sceneEl.querySelector('#centerRight');
        this.centerEntity = this.el.sceneEl.querySelector('#centerEntity');
        this.labMemberInfo = this.el.sceneEl.querySelector('#labMemberInfo');
        this.labMemberInfoPlane = this.el.sceneEl.querySelector('#labMemberInfoPlane');
        this.doorsOpen = false;
        this.modelURL = null;
        //this.coneGeometry = new THREE.ConeGeometry(0.05, 0.2, 8)
        //const material = new THREE.MeshNormalMaterial()
        console.log(this.centerEntity);
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

                                    // Scale
                                    if (jsonData.model.scale) {
                                        console.log("Setting scale!");
                                        this.centerEntity.setAttribute("scale", jsonData.model.scale);
                                    }
                                    else {
                                        // Default
                                        this.centerEntity.setAttribute("scale", "0.2 0.2 0.2");
                                    }

                                    // Position
            /*                                    if (jsonData.model.position) {
                                                console.log("Setting position!");
                                                this.centerEntity.setAttribute("position", jsonData.model.position);
                                            }
                                            else {
                                                // Default
                                                this.centerEntity.setAttribute("scale", "0 0 -1");
                                            }*/

                                }

                                // Set the gltf-model attribute of the center entity to the model URL
                                this.centerEntity.setAttribute("gltf-model", this.modelUrl);

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
        }, 1000); // Delay displayModel for 1
    },

    hideModelAndCloseDoors: function () {
        this.hideModel(0.005, -1);
        setTimeout(() => {
            this.closeDoors(0.005);
        }, 5000); // Delay closing doors for 1
    },
    
});


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