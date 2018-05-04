
/*
  Sets up the scene with camera, renderer, controls and other shit.
*/

import {SceneSubjects} from "./sceneSubjects/sceneSubjects.js"

export function SceneManager(canvas) {

  let then = new Date().getTime() / 100 

  const screenDimensions = {
    width: canvas.width,
    height: canvas.height 
  }

  const scene = buildScene()
  const renderer = buildRenderer(screenDimensions)
  const camera = buildCamera(screenDimensions)
  const controls = createControls(camera)
  const sceneSubjects = createSceneSubjects(scene)

  //initiate the THREE.js scene
  function buildScene() {
    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#000')

    return scene;
  }

  //Sets up the renderer
  function buildRenderer({width, height}) {
    const renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true, alpha: true})
    renderer.setSize(width, height)
    /* DEVICE PIXEL RATIO*/
    const DPR = /* (window.devicePixelRatio)? window.devicePixelRatio : */ 1 //Manages the pixel ratio. Uncomment to enable retina support (performance hungry)
    renderer.setPixelRatio(DPR) 
    /* SHADOWS */
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFoftShadowMap

    return renderer

  }

  //Sets ups camera and place it in the scene
  function buildCamera({width, height}) {
    const aspectRatio = width / height
    const fov = 60
    const nearPlane = 0.1
    const farPlane = 1000
    const camera = new THREE.PerspectiveCamera(fov, aspectRatio, nearPlane, farPlane)
    camera.position.z = 10
    camera.position.y = 3

    return camera
  }

  //orbital controls setup
  function createControls(camera) {
    const controls = new THREE.OrbitControls(camera)

    return controls
  }

  function createSceneSubjects(scene) {
    const sceneSubjects = new SceneSubjects(scene) 

    return sceneSubjects
  }

  //This fonction updates the scene and calls the renderers
  this.update = function() {

    let now = new Date().getTime() / 100 
    let delta = now - then
    let frameTime = 60 / 1000
    
    //This makes sure physics update as if the refresh rate was 60fps regardless of actual framerate
    if (delta > frameTime ) {
      let frameNumber = delta / frameTime
      for (var i = 1; i < frameNumber; i++) {
        sceneSubjects.update()
      }
    }

    renderer.render(scene, camera)
    controls.update()
    
    then = new Date().getTime() / 100
  }

  //dynamically resize the scene and camera
  this.onWindowResize = function() {
    const {width, height} = canvas;

    screenDimensions.height = height
    screenDimensions.width = width

    camera.aspect = width / height 
    camera.updateProjectionMatrix();

    renderer.setSize(width, height)
  }
}