/**
 *	Empty Sketch
 */
import * as THREE from "three";
import vertexShader from "./shader.vert"
import fragmentShader from "./shader.frag"

let width = window.innerWidth;
let height = window.innerHeight;
const canvas = document.createElement("canvas");
document.body.appendChild(canvas);

const renderer = new THREE.WebGLRenderer({canvas});
renderer.setSize(width, height);
renderer.setClearColor(0x000000);

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2);
camera.position.z = 1;

const uniforms = {
	u_time: new THREE.Uniform(0),
	u_resolution: new THREE.Uniform(new THREE.Vector2(width, height))
};

let geo = new THREE.PlaneGeometry(width, height, 2, 2);

let mat = new THREE.ShaderMaterial({
	uniforms,
	vertexShader,
	fragmentShader
});

let mesh = new THREE.Mesh(geo, mat);
scene.add(mesh);

(function animate() {

	uniforms.u_time.value += 0.01;

	renderer.render(scene, camera);

	window.requestAnimationFrame(animate);

})();

window.addEventListener("resize", () => {
	width = 800;
	height = 800;
	renderer.setSize(width, height);
});
