(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var _sceneManager = require("./sceneManager.js");

var canvas = document.getElementById("renderCanvas"); /*
                                                        This file manages the canvas.
                                                        It makes sure the canvas is dynamically resized.
                                                        Calls the render function. 
                                                      */

var sceneManager = new _sceneManager.SceneManager(canvas);

bindEventListener();
render();

//Window resize listener
function bindEventListener() {
  window.onresize = resizeCanvas;
  resizeCanvas();
}

//Canvas resize
function resizeCanvas() {
  canvas.style.width = '100%';
  canvas.style.height = '100%';

  canvas.height = canvas.offsetHeight;
  canvas.width = canvas.offsetWidth;

  sceneManager.onWindowResize();
}

//Scene render
function render() {
  requestAnimationFrame(render);
  sceneManager.update();
}

},{"./sceneManager.js":2}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SceneManager = SceneManager;

var _sceneSubjects = require("./sceneSubjects/sceneSubjects.js");

function SceneManager(canvas) {

  var then = new Date().getTime() / 100;

  var screenDimensions = {
    width: canvas.width,
    height: canvas.height
  };

  var scene = buildScene();
  var renderer = buildRenderer(screenDimensions);
  var camera = buildCamera(screenDimensions);
  var controls = createControls(camera);
  var sceneSubjects = createSceneSubjects(scene);

  //initiate the THREE.js scene
  function buildScene() {
    var scene = new THREE.Scene();
    scene.background = new THREE.Color('#000');

    return scene;
  }

  //Sets up the renderer
  function buildRenderer(_ref) {
    var width = _ref.width,
        height = _ref.height;

    var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setSize(width, height);
    /* DEVICE PIXEL RATIO*/
    var DPR = /* (window.devicePixelRatio)? window.devicePixelRatio : */1; //Manages the pixel ratio. Uncomment to enable retina support (performance hungry)
    renderer.setPixelRatio(DPR);
    /* SHADOWS */
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFoftShadowMap;

    return renderer;
  }

  //Sets ups camera and place it in the scene
  function buildCamera(_ref2) {
    var width = _ref2.width,
        height = _ref2.height;

    var aspectRatio = width / height;
    var fov = 60;
    var nearPlane = 0.1;
    var farPlane = 1000;
    var camera = new THREE.PerspectiveCamera(fov, aspectRatio, nearPlane, farPlane);
    camera.position.z = 10;
    camera.position.y = 3;

    return camera;
  }

  //orbital controls setup
  function createControls(camera) {
    var controls = new THREE.OrbitControls(camera);

    return controls;
  }

  function createSceneSubjects(scene) {
    var sceneSubjects = new _sceneSubjects.SceneSubjects(scene);

    return sceneSubjects;
  }

  //This fonction updates the scene and calls the renderers
  this.update = function () {

    var now = new Date().getTime() / 100;
    var delta = now - then;
    var frameTime = 60 / 1000;

    //This makes sure physics update as if the refresh rate was 60fps regardless of actual framerate
    if (delta > frameTime) {
      var frameNumber = delta / frameTime;
      for (var i = 1; i < frameNumber; i++) {
        sceneSubjects.update();
      }
    }

    renderer.render(scene, camera);
    controls.update();

    then = new Date().getTime() / 100;
  };

  //dynamically resize the scene and camera
  this.onWindowResize = function () {
    var width = canvas.width,
        height = canvas.height;


    screenDimensions.height = height;
    screenDimensions.width = width;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
  };
}
/*
  Sets up the scene with camera, renderer, controls and other shit.
*/

},{"./sceneSubjects/sceneSubjects.js":6}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SceneLights = SceneLights;
function SceneLights(scene) {

  var generalLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.1);
  scene.add(generalLight);

  var ballLight = new THREE.PointLight(0xffffff, 1, 20, 2);
  ballLight.castShadow = true;
  ballLight.position.set(2, 10, 1);
  scene.add(ballLight);

  var lights = {
    generalLight: generalLight,
    ballLight: ballLight
  };

  return lights;
}

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SceneMeshes = SceneMeshes;
function SceneMeshes(scene) {

  var pi = 3.1415;

  var groundGeometry = new THREE.PlaneGeometry(100, 100, 4);
  var groundMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff, flatshading: true });
  var plane = new THREE.Mesh(groundGeometry, groundMaterial);
  plane.receiveShadow = true;
  scene.add(plane);
  plane.rotation.x = -(pi / 2);

  var cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
  var cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cube.castShadow = false;
  scene.add(cube);

  var meshes = {
    plane: plane,
    cube: cube
  };

  return meshes;
}

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ScenePhysics = ScenePhysics;
function ScenePhysics(scene) {

  var world = new CANNON.World();
  var timeStep = 1 / 60;
  world.gravity.set(0, -5, 0);
  world.broadphase = new CANNON.NaiveBroadphase();

  var bodyGround = new CANNON.Body({
    mass: 0,
    shape: new CANNON.Plane()
  });
  world.addBody(bodyGround);

  var bodyCube = new CANNON.Body({
    mass: 5,
    position: new CANNON.Vec3(0, 7, 0),
    shape: new CANNON.Box(new CANNON.Vec3(.5, .5, .5))
  });
  world.addBody(bodyCube);

  var physics = {
    world: world,
    timeStep: timeStep,
    bodyGround: bodyGround,
    bodyCube: bodyCube
  };

  return physics;
}

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SceneSubjects = SceneSubjects;

var _sceneLights = require("./sceneLights.js");

var _sceneMeshes = require("./sceneMeshes.js");

var _scenePhysics = require("./scenePhysics.js");

function SceneSubjects(scene) {

  var sceneMeshes = (0, _sceneMeshes.SceneMeshes)(scene);
  var sceneLights = (0, _sceneLights.SceneLights)(scene);
  var scenePhysics = (0, _scenePhysics.ScenePhysics)(scene);

  //Links Physical objects to meshes 
  function updatePhysics(scenePhysics, sceneMeshes) {

    sceneMeshes.cube.position.copy(scenePhysics.bodyCube.position);
    sceneMeshes.cube.quaternion.copy(scenePhysics.bodyCube.quaternion);
    sceneLights.ballLight.position.copy(scenePhysics.bodyCube.position);

    scenePhysics.bodyGround.position.copy(sceneMeshes.plane.position);
    scenePhysics.bodyGround.quaternion.copy(sceneMeshes.plane.quaternion);

    scenePhysics.world.step(scenePhysics.timeStep);
  }

  this.update = function () {
    updatePhysics(scenePhysics, sceneMeshes);
  };
} //manages the subjects (lights, meshes and physics)

},{"./sceneLights.js":3,"./sceneMeshes.js":4,"./scenePhysics.js":5}]},{},[1]);
