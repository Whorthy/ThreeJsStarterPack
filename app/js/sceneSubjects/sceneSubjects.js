//manages the subjects (lights, meshes and physics)
import {SceneLights} from "./sceneLights.js"
import {SceneMeshes} from "./sceneMeshes.js"
import {ScenePhysics} from "./scenePhysics.js"

export function SceneSubjects(scene) {

  const sceneMeshes = SceneMeshes(scene)
  const sceneLights = SceneLights(scene)
  const scenePhysics = ScenePhysics(scene)

  //Links Physical objects to meshes 
  function updatePhysics(scenePhysics, sceneMeshes) {

    sceneMeshes.cube.position.copy(scenePhysics.bodyCube.position)
    sceneMeshes.cube.quaternion.copy(scenePhysics.bodyCube.quaternion)
    sceneLights.ballLight.position.copy(scenePhysics.bodyCube.position)

    scenePhysics.bodyGround.position.copy(sceneMeshes.plane.position)
    scenePhysics.bodyGround.quaternion.copy(sceneMeshes.plane.quaternion)

    scenePhysics.world.step(scenePhysics.timeStep)
  }

  this.update = function() {
    updatePhysics(scenePhysics, sceneMeshes)
  }
}