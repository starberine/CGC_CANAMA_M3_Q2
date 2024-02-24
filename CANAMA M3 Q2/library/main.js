import * as THREE from './three.module.js';
import { FontLoader } from './FontLoader.js';
import { TextGeometry } from './TextGeometry.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 10, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; // Enable shadow map
document.body.appendChild(renderer.domElement);

let textMesh;
let stars, starGeo;

lighting();
text();
particles();

function lighting() {
  const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x000000, 1);
  hemisphereLight.castShadow = true; // Enable shadow casting
  scene.add(hemisphereLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(0, 50, 0);
  directionalLight.castShadow = true; // Enable shadow casting
  scene.add(directionalLight);

  const ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);
}


function particles() {
  const points = Array.from({ length: 6000 }, () => new THREE.Vector3(
    Math.random() * 600 - 300,
    Math.random() * 600 - 300,
    Math.random() * 600 - 300
  ));

  starGeo = new THREE.BufferGeometry().setFromPoints(points);
  const sprite = new THREE.TextureLoader().load("assets/images/star.png");
  const starMaterial = new THREE.PointsMaterial({ color: new THREE.Color(1, 1, 1), size: 0.7, map: sprite });
  stars = new THREE.Points(starGeo, starMaterial);
  scene.add(stars);
}

function animateParticles() {
  const vertices = starGeo.attributes.position.array;

  for (let i = 1; i < vertices.length; i += 3) {
    vertices[i] -= 0.9;

    if (vertices[i] < -300) {
      vertices[i] = 300;
    }
  }

  starGeo.attributes.position.needsUpdate = true;
}

function text() {
  const texture = new THREE.TextureLoader().load("../assets/textures/Metal041A_1K-JPG_Displacement.jpg");

  const loader = new FontLoader();
  loader.load('../assets/fonts/Chiller.json', function (font) {
    const textGeometry = new TextGeometry('Arin', { font, size: 3, height: 1 });
    textGeometry.center();
    const textMaterial = new THREE.MeshStandardMaterial({ map: texture });

    if (!textMesh) {
      textMesh = new THREE.Mesh(textGeometry, textMaterial);
      textMesh.castShadow = true; // Enable shadow casting
      textMesh.receiveShadow = true; // Enable shadow receiving
      scene.add(textMesh);
    } else {
      // If textMesh already exists, update its geometry and material
      textMesh.geometry = textGeometry;
      textMesh.material = textMaterial;
    }

    // Set position after textMesh is created or updated
    textMesh.position.z = -5;
  });

  camera.position.z = 15;
}


function changeColor() {
  const targetColor = generateRandomRGBColor();
  smoothColorTransition(stars.material.color, targetColor);
}

function generateRandomRGBColor() {
  return new THREE.Color(Math.random(), Math.random(), Math.random());
}

function smoothColorTransition(currentColor, targetColor) {
  const interpolationFactor = 0.5;

  currentColor.r = lerp(currentColor.r, targetColor.r, interpolationFactor);
  currentColor.g = lerp(currentColor.g, targetColor.g, interpolationFactor);
  currentColor.b = lerp(currentColor.b, targetColor.b, interpolationFactor);
}

function lerp(start, end, alpha) {
  return (1 - alpha) * start + alpha * end;
}

function animate() {
  requestAnimationFrame(animate);

  animateParticles();

  textMesh.rotation.x += 0.005;
  textMesh.rotation.y += 0.005;
  textMesh.rotation.z += 0.005;

   changeColor();

  renderer.render(scene, camera);
}

animate();
setInterval(changeColor, 3000);
