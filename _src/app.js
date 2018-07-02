class World {
    constructor(width, height) {

        this.renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
        });
        this.renderer.setPixelRatio(1);
        this.renderer.setSize(width, height);
        this.container = document.getElementsByClassName("world")[0];
        this.scene = new THREE.Scene();
        this.width = width;
        this.height = height;
        this.aspectRatio = width / height;
        this.fieldOfView = 50;
        var nearPlane = .1;
        var farPlane = 20000;
        this.camera = new THREE.PerspectiveCamera(this.fieldOfView, this.aspectRatio, nearPlane, farPlane);
        this.camera.position.z = 300;
        this.container.appendChild(this.renderer.domElement);
        this.timer = 0;
        this.createPlane();
        this.render();
    }

    createPlane() {
        this.tunnelmaterial = new THREE.RawShaderMaterial({
            vertexShader: document.getElementById('vertTunnelShader').textContent,
            fragmentShader: document.getElementById('fragTunnelShader').textContent,
            side: THREE.BackSide,
            uniforms: {
                time: { type: 'f', value: 0 },
                mousePosition: { type: 'v2', value: new THREE.Vector2(0.5, 0.5) }
            }
        });
        this.tunnelGeometry = new THREE.CylinderGeometry(40, 40, 250, 50, 1, true);
        this.tunnelGeometry.applyMatrix(new THREE.Matrix4().makeRotationX(PI / 2));
        this.tunnelGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 200));
        this.tunnel = new THREE.Mesh(this.tunnelGeometry, this.tunnelmaterial);
        this.scene.add(this.tunnel);

        this.starsMaterial = new THREE.RawShaderMaterial({
            vertexShader: document.getElementById('vertStarsShader').textContent,
            fragmentShader: document.getElementById('fragStarsShader').textContent,
            uniforms: {
                time: { type: 'f', value: 0 },
                mousePosition: { type: 'v2', value: new THREE.Vector2(0.5, 0.5) }
            }
        });

        this.starsGeometry = new THREE.PlaneGeometry(120, 120, 1, 1);
        this.stars = new THREE.Mesh(this.starsGeometry, this.starsMaterial);
        this.stars.position.z = -10;
        this.scene.add(this.stars);
    }

    render() {
        this.timer += .005;
        this.tunnel.material.uniforms.time.value = this.timer;
        this.stars.material.uniforms.time.value = this.timer;
        this.renderer.render(this.scene, this.camera);
    }

    loop() {
        this.render();
        requestAnimationFrame(this.loop.bind(this));
    }

    updateSize(w, h) {
        this.renderer.setSize(w, h);
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
    }
    mouseMove(mousePos) {
        if (this.tunnel) {
            this.tunnel.material.uniforms.mousePosition.value = new THREE.Vector2(mousePos.px, -mousePos.py);
            this.tunnel.rotation.y = -mousePos.px * 3;
            this.tunnel.rotation.x = -mousePos.py * .09;

            this.stars.material.uniforms.mousePosition.value = new THREE.Vector2(mousePos.px, -mousePos.py);

        }
    }
};

document.addEventListener("DOMContentLoaded", domIsReady);
let mousePos = { x: 0, y: 0, px: 0, py: 0 };
let PI = Math.PI;
let world;

function domIsReady() {
    world = new World(this.container, this.renderer, window.innerWidth, window.innerHeight);
    window.addEventListener('resize', handleWindowResize, false);
    document.addEventListener("mousemove", handleMouseMove, false);
    handleWindowResize();
    world.loop();
}

function handleWindowResize() {
    world.updateSize(window.innerWidth, window.innerHeight);
}

function handleMouseMove(e) {
    mousePos.x = e.clientX;
    mousePos.y = e.clientY;
    mousePos.px = mousePos.x / window.innerWidth * 2 - 1;
    mousePos.py = mousePos.y / window.innerHeight * 2 - 1;
    world.mouseMove(mousePos);
}