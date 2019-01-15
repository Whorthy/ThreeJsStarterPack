/*
  This file manages the canvas.
  It makes sure the canvas is dynamically resized.
  Calls the render function. 
*/

import SceneManager from "./sceneManager.js"

const canvas = document.getElementById("renderCanvas")

const sceneManager = new SceneManager(canvas)

bindEventListener()
render()

//Window resize listener
function bindEventListener() {
  window.onresize = resizeCanvas
  resizeCanvas()
}

//Canvas resize
function resizeCanvas() {
  canvas.style.width = '100%'
  canvas.style.height = '100%'

  canvas.height = canvas.offsetHeight
  canvas.width = canvas.offsetWidth

  sceneManager.ResizeHandler(canvas)
}

//Scene render
function render() {
  requestAnimationFrame(render)
  sceneManager.Update()
}

