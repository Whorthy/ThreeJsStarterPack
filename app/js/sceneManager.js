import {Scene, Color, WebGLRenderer, PerspectiveCamera} from "three"
import OrbitControls from "three-orbitcontrols"
import {SceneSubjects} from "./sceneSubjects/sceneSubjects.js"

/*
  Sets up the scene with camera, renderer, controls and other utlities.
*/

class SceneManager
{
  //------------------------------------------------------------------------- Constructor

  constructor(canvas)
  {
    this.canvas = canvas

    this.screenDimensions = {
      height: this.canvas.height,
      width: this.canvas.width
    }

    this.scene = this.SceneBuilder()
    this.camera = this.CameraBuilder(this.canvas)
    this.renderer = this.RendererBuilder(this.canvas)
    this.controls = this.ControlsBuilder(this.camera, this.renderer)
    this.then = new Date().getTime() / 100
    this.sceneSubjects = this.CreateSceneSubjects()

  }

  //------------------------------------------------------------------------- Methods

  // we initialize the scene with a black background
  SceneBuilder()
  {
    const scene = new THREE.Scene()

    scene.background = new THREE.Color('#000')

    return scene

  }

  // we create the renderer which has support for shadows and retina screens 
  RendererBuilder({width, height})
  {
    const renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true
    })

    // retina support 
    const devicePixelRatio = /* (window.devicePixelRatio)? window.devicePixelRatio : */ 1 //Manages the pixel ratio. Uncomment to enable retina support (performance hungry)

    renderer.setSize(width, height)
    renderer.setPixelRatio(devicePixelRatio)
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFoftShadowMap

    return renderer
  }

  CameraBuilder({width, height})
  {
    const aspectRatio = width / height
    const fov = 60
    const nearPlane = 0.1
    const farPlane = 1000

    const camera = new THREE.PerspectiveCamera(fov, aspectRatio, nearPlane, farPlane)

    camera.position.z = 10
    camera.position.y = 3

    return camera 

  }

  // We add orbital controls to turn around the scene 
  ControlsBuilder(camera, renderer)
  {
    const controls = new OrbitControls(camera, renderer.domElement)

    return controls

  }

  CreateSceneSubjects()
  {
    const sceneSubjects = new SceneSubjects(this.scene)

    return sceneSubjects

  }

  // update loop. This is ran for each frame 
  Update()
  {

    //This makes sure physics update as if the refresh rate was 60fps regardless of actual framerate
    let now = new Date().getTime() / 100 
    let delta = now - this.then
    const frameTime = 60 / 1000
    
    if (delta > frameTime ) {
      let frameNumber = delta / frameTime
      for (var i = 1; i < frameNumber; i++) {
        this.sceneSubjects.update()
      }
    }

    this.then = new Date().getTime() / 100


    this.renderer.render(this.scene, this.camera)
    this.controls.update()
    
  }

  // We make it so when the window is resized, so is the canvas and the camera to avoid image distorsion
  ResizeHandler({width, height})
  {

    this.screenDimensions.height = height
    this.screenDimensions.width = width

    this.camera.aspect = width / height 
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height)
  
  }

}

export default SceneManager
