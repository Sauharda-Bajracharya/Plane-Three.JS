import './style.css';
import * as THREE from 'three';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const canvas = document.querySelector('canvas.webgl');
const cursorCircle = document.querySelector('.cursor-circle');

const navbarDetailsLink = document.querySelector('.navbar-right li:first-child a');
const detailsDiv = document.querySelector('.details');

navbarDetailsLink.addEventListener('click', () => {
    detailsDiv.classList.toggle('hidden');
});

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.set(0, 9, 9);
scene.add(camera);

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('draco/');
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

const spotLight = new THREE.AmbientLight(0xffffff);
spotLight.position.set(1, 1, 0);
scene.add(spotLight);

const newSpotLight = new THREE.DirectionalLight(0xffffff);
newSpotLight.position.set(0, 1, 0);
scene.add(newSpotLight);

const groundGeometry = new THREE.PlaneGeometry(500, 1000, 1, 1);
const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0x4D4855,
    roughness: 0.0,
    metalness: 0.9
});
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = Math.PI * -0.5;
ground.position.set(0, 0.3, 0); // New position (x, y, z)
scene.add(ground);

// const circularPlatformRadius = 3;
// const circularPlatformHeight = 0.01;
// const circularPlatformGeometry = new THREE.CylinderGeometry(
//     circularPlatformRadius, circularPlatformRadius, circularPlatformHeight, 64
// );
// const circularPlatformMaterial = new THREE.MeshStandardMaterial({
//     color: 0xffffff, 
//     roughness: 0.5,
//     metalness: 0.5
// });

// const circularPlatform = new THREE.Mesh(circularPlatformGeometry, circularPlatformMaterial);
// circularPlatform.position.set(-0.5, 0.5, -0.5); // New position (x, y, z)
// circularPlatform.position.y = 0.4;
// scene.add(circularPlatform);

// Runway Geometry
const runwayLength = 100; // Adjust the length as needed
const runwayWidth = 1000; // Adjust the width as needed
const runwayGeometry = new THREE.PlaneGeometry(runwayLength, runwayWidth, 1, 1);

// Runway Material
const runwayMaterial = new THREE.MeshStandardMaterial({
    color: 0x808080, // Gray color for the runway
    roughness: 0.2,
    metalness: 0.0,
});

const textureLoader = new THREE.TextureLoader();
const stripeTexture = textureLoader.load('ground.png'); // Provide the correct path
stripeTexture.wrapS = THREE.RepeatWrapping;
stripeTexture.wrapT = THREE.RepeatWrapping;
stripeTexture.repeat.set(10, 1); // Adjust the repeat factor to control the number of stripes

runwayMaterial.map = stripeTexture;

const runway = new THREE.Mesh(runwayGeometry, runwayMaterial);
runway.rotation.x = -Math.PI / 2; // Rotate to lay the runway flat
runway.position.set(0, 0.4, 0); // Adjust the position as needed
scene.add(runway);


let car;
gltfLoader.load('dream.glb', (gltf) => {
    car = gltf.scene;
    scene.add(car);
});

const cursor = { x: 0, y: 0 };
window.addEventListener('mousemove', (event) => {
    const x = event.clientX;
    const y = event.clientY;
    cursorCircle.style.left = `${x}px`;
    cursorCircle.style.top = `${y}px`;
});

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);

const controls = new OrbitControls(camera, canvas);

window.addEventListener('dblclick', () => {
    if (!document.fullscreenElement) {
        canvas.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
});

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

function createSphereMarker(material, position) {
    const markerGeometry = new THREE.SphereGeometry(0.06, 64, 64, Math.PI, Math.PI);
    const marker = new THREE.Mesh(markerGeometry, material);
    marker.rotation.x = Math.PI / 2; 
    marker.position.copy(position);
    scene.add(marker);
    return marker;
}

window.addEventListener('click', onClick);

function onClick(event) {
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(
        interactiveParts.map((part) => part.marker)
    );

    if (intersects.length > 0) {
        const clickedObject = intersects[0].object;
        const clickedPart = interactiveParts.find(
            (part) => part.marker === clickedObject
        );

        if (clickedPart) {
            showInformation(clickedPart.description);
        }
    }
}

function showInformation(text) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = text;
    document.body.appendChild(tooltip);

    window.addEventListener('click', () => {
        document.body.removeChild(tooltip);

    });
    
}

const detailLines = [];

const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 10 });

const points1 = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(1, 1, 1), 
    new THREE.Vector3(0.1, 0.1, 0.05),
];

const points2 = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(1, 0, 0), 
];

points1.forEach((point) => {
    point.y -= 0; 
});

points2.forEach((point) => {
    point.y -= 0.2;
});

const lineGeometry1 = new THREE.BufferGeometry().setFromPoints(points1);
const lineGeometry2 = new THREE.BufferGeometry().setFromPoints(points2);

const line1 = new THREE.Line(lineGeometry1, lineMaterial);
line1.visible = false;
scene.add(line1);
detailLines.push(line1);

const line2 = new THREE.Line(lineGeometry2, lineMaterial);
line2.visible = false;
scene.add(line2);
detailLines.push(line2);

function toggleDetailLines() {
    const isVisible = detailLines[0].visible;

    detailLines.forEach((line) => {
        line.visible = !isVisible;
    });
}

// STARS

const starPositions = [];

const numStars = 1000; 

for (let i = 0; i < numStars; i++) {
    
    const x = Math.random() * 2000 - 1000; 
    const y = Math.random() * 2000 - 1000;
    const z = Math.random() * 2000 - 1000;

    starPositions.push({ x, y, z });
}

const starSpheres = [];

const starMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff }); 

for (const position of starPositions) {
    const starGeometry = new THREE.SphereGeometry(1, 16, 16); 
    const starSphere = new THREE.Mesh(starGeometry, starMaterial);

    starSphere.position.set(position.x, position.y, position.z);

    starSpheres.push(starSphere);
    scene.add(starSphere);
}

starSpheres.forEach((starSphere) => {
    starSphere.renderOrder = -1;
});

// CONTROLS

const keyboard = {
    ArrowUp: false,
    ArrowLeft: false,
    ArrowRight: false,
    ArrowDown: false
};

const handleKeyDown = (event) => {
    if (event.key === 'ArrowUp') keyboard.w = true;
    if (event.key === 'ArrowLeft') keyboard.a = true;
    if (event.key === 'ArrowRight') keyboard.d = true;
    if (event.key === 'ArrowDown') keyboard.s = true;
};

const handleKeyUp = (event) => {
    if (event.key === 'ArrowUp') keyboard.w = false;
    if (event.key === 'ArrowLeft') keyboard.a = false;
    if (event.key === 'ArrowRight') keyboard.d = false;
    if (event.key === 'ArrowDown') keyboard.s = false;
};

window.addEventListener('keydown', handleKeyDown);
window.addEventListener('keyup', handleKeyUp);

window.addEventListener('keydown', (event) => {
    if (event.key === 'r') {
        resetCameraPosition();
    }
});

function resetCameraPosition() {
    camera.position.set(0.18, 0.145, 0.18);
}

const animate = () => {
    // const rotationSpeed = 0.00000;
    // const time = Date.now() * rotationSpeed;

    // const cameraDistance = 0.31;
    // camera.position.x = Math.cos(time) * cameraDistance;
    // camera.position.z = Math.sin(time) * cameraDistance;
    // camera.position.y = circularPlatformHeight + 5;
    // camera.lookAt(circularPlatform.position);

    // if (keyboard.w) {
    //     camera.position.copy(car.position);
    //     camera.position.y += 0.31; 
    //     camera.lookAt(car.position);
    //     car.rotation.y += Math.PI * 2; 
    // } 
    // if (keyboard.a) {
    //     camera.position.copy(car.position);
    //     camera.position.x += 0.31; 
    //     camera.position.y = 0.12; 
    //     camera.lookAt(car.position); 
    // }
    // if (keyboard.d) {
    //     camera.position.copy(car.position);
    //     camera.position.x -= 0.31; 
    //     camera.position.y = 0.12; 
    //     camera.lookAt(car.position); 
    // }
    // if (keyboard.s) {
    //     camera.position.copy(car.position);
    //     camera.lookAt(car.position);
    //     camera.position.y = 0.1; 
    //     camera.position.z += 0.37; 
    // }

    renderer.render(scene, camera);
    controls.update();

    requestAnimationFrame(animate);
}

animate();

const glowLight = new THREE.AmbientLight(0x1F2022); 
scene.add(glowLight);

window.addEventListener('keydown', (event) => {
    if (event.key === 'c' || event.key === 'C') {

        const randomColor = Math.random() * 0xffffff;

        glowLight.color.set(randomColor);
    }
});

// Define initial car exterior color
// let currentCarExteriorColor = 0xff0000; // Red

// Event listener for 'C' key press
window.addEventListener('keydown', (event) => {
    if (event.key === 'r' || event.key === 'R') {

        const randomColor = 0x1F2022;

        glowLight.color.set(randomColor);

    }
});
