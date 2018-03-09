const canvas = document.getElementById("renderCanvas")

const sceneManager = new SceneManager(canvas)

bindEventListener()
render()

function bindEventListener() {
  window.onresize = resizeCanvas
  resizeCanvas()
}

function resizeCanvas() {
  canvas.style.width = '100%'
  canvas.style.height = '100%'

  canvas.height = canvas.offsetHeight
  canvas.width = canvas.offsetWidth

  sceneManager.onWindowResize()
}

function render() {
  requestAnimationFrame(render)
  sceneManager.update()
}

