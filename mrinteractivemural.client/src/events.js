import { AR } from './ar.js';

AFRAME.registerComponent('markerhandler', {
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
});
AFRAME.registerComponent('click-listener', {
    init: function () {
        this.camera = this.el.sceneEl.camera;
        // Bind the onClick function to this component instance and listen for click events on the scene
        this.onClick = this.onClick.bind(this);
        this.el.sceneEl.addEventListener('click', this.onClick);
        this.clipNames = ['idle', 'hiphop', 'chicken', 'pockets'];
        this.currentClipIndex = 0;
        // Prepare a new THREE.Raycaster
        this.raycaster = new THREE.Raycaster();

        this.coneGeometry = new THREE.ConeGeometry(0.05, 0.2, 8)
        const material = new THREE.MeshNormalMaterial()


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
        this.camera.lookAt(this.el.sceneEl.object3D.position );
        this.camera.updateMatrixWorld();

        // Convert the click position to normalized device coordinates (NDC)
        const x = (clickPosition.x / window.innerWidth) * 2 - 1;
        const y = -(clickPosition.y / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(new THREE.Vector2(x, y), this.camera);
      
        // Perform the raycast. This example checks against all objects in the scene; you might want to filter this
        const intersects = this.raycaster.intersectObjects(this.el.sceneEl.object3D.children, true);


        if (intersects.length > 0) {
            // Log or handle the first intersected object
            console.log("INTERSECTIONS");
            console.log(intersects);
            const firstIntersection = intersects[0].object.el; // Get the A-Frame element of the intersected object
            if (firstIntersection.matches('#plane')) {
                console.log('Intersected with the plane! ' + firstIntersection.getAttribute('name'));
                // Additional logic based on the intersection can be added here
                AR.loadModelById(firstIntersection.getAttribute('name'))
            }
        }
















        /*if (intersects.length > 0) {
            let n = new THREE.Vector3()
            n.copy(intersects[0].face.normal)
            n.transformDirection(intersects[0].object.matrixWorld)
            const cube = new THREE.Mesh(this.coneGeometry, this.material)
            cube.lookAt(n)
            cube.rotateX(Math.PI / 2)
            cube.position.copy(intersects[0].point)
            cube.position.addScaledVector(n, 0.1)
            this.el.sceneEl.object3D.add(cube)
        }*/













        // Process intersections
        /*if (intersects.length > 0) {
            // Log or handle the first intersected object
            console.log("INTERSECTIONS");
            console.log(intersects);
            const firstIntersection = intersects[0].object.el; // Get the A-Frame element of the intersected object
            if (firstIntersection.matches('#model-wrapper')) {
                console.log('Intersected with the plane! ' + firstIntersection.getAttribute('name'));
                // Additional logic based on the intersection can be added here
                firstIntersection.addEventListener('click', () => {
                    const targetEl = firstIntersection.querySelector('[gltf-model]');
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
        }*/
    }
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