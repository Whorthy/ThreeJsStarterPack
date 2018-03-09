function SceneManager(canvas) {

  let then = new Date().getTime() / 100 

  const screenDimensions = {
    width: canvas.width,
    height: canvas.height 
  }

  const scene = buildScene()
  const renderer = buildRenderer(screenDimensions)
  const camera = buildCamera(screenDimensions)
  const controls = createControls(camera)

  function buildScene() {
    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#000')

    return scene;
  }

  function buildRenderer({width, height}) {
    const renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true, alpha: true})
    const DPR = /* (window.devicePixelRatio)? window.devicePixelRatio : */ 1
    renderer.setPixelRatio(DPR) 
    renderer.setSize(width, height)
    /* SHADOWS */ 
    /* renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFoftShadowMap */

    return renderer

  }

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

  function createControls(camera) {
    const controls = new THREE.OrbitControls(camera)

    return controls
  }

  this.update = function() {

    let now = new Date().getTime() / 100 
    let delta = now - then
    let frameTime = 60 / 1000
    
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

  this.onWindowResize = function() {
    const {width, height} = canvas;

    screenDimensions.height = height
    screenDimensions.width = width

    camera.aspect = width / height 
    camera.updateProjectionMatrix();

    renderer.setSize(width, height)
  }
}