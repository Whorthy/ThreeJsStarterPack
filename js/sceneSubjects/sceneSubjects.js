function SceneSubjects(scene) {

  const sceneMeshes = SceneMeshes(scene)
  const sceneLights = SceneLights(scene)
  const scenePhysics = ScenePhysics(scene)

  function updatePhysics(scenePhysics, sceneMeshes) {

    sceneMeshes.cube.position.copy(scenePhysics.bodyCube.position)
    sceneMeshes.cube.quaternion.copy(scenePhysics.bodyCube.quaternion)

    scenePhysics.bodyGround.position.copy(sceneMeshes.plane.position)
    scenePhysics.bodyGround.quaternion.copy(sceneMeshes.plane.quaternion)

    scenePhysics.world.step(scenePhysics.timeStep)
  }

  this.update = function() {
    updatePhysics(scenePhysics, sceneMeshes)
  }
}