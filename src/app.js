/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import { WebGLRenderer, PerspectiveCamera, Vector3, AudioListener } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { MainScene } from 'scenes';
import data from './data';

// Initialize core ThreeJS components

const queryString = window.location.search;
console.log(queryString);
const urlParams = new URLSearchParams(queryString);
const name = urlParams.get('name')
console.log(name);


const list = JSON.parse(JSON.stringify(data))[0];

let color;
if (name != null) {
    color = list[name]['color'];
} else {
    color = "rgb(135, 255, 151)";
}

const scene = new MainScene(color);
const camera = new PerspectiveCamera();
const renderer = new WebGLRenderer({ antialias: true });

// Set up camera
camera.position.set(0, 0, 150);
camera.lookAt(new Vector3(0, 0, 0));



// Set up renderer, canvas, and minor CSS adjustments
renderer.setPixelRatio(window.devicePixelRatio);
const canvas = renderer.domElement;
canvas.style.display = 'block'; // Removes padding below canvas
document.body.style.margin = 0; // Removes margin around page
document.body.style.overflow = 'hidden'; // Fix scrolling
document.body.appendChild(canvas);




// Set up controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 4;
controls.maxDistance = 1000;
controls.update();

// Render loop
const onAnimationFrameHandler = (timeStamp) => {
    controls.update();
    renderer.render(scene, camera);
    scene.update && scene.update(timeStamp);
    window.requestAnimationFrame(onAnimationFrameHandler);
};
window.requestAnimationFrame(onAnimationFrameHandler);

// Resize Handler
const windowResizeHandler = () => {
    const { innerHeight, innerWidth } = window;
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
};
windowResizeHandler();
window.addEventListener('resize', windowResizeHandler, false);