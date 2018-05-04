export function ScenePhysics(scene) {

  const world = new CANNON.World()
  const timeStep = 1/60
  world.gravity.set(0, -5, 0)
  world.broadphase = new CANNON.NaiveBroadphase()

  const bodyGround = new CANNON.Body({
    mass:0,
    shape: new CANNON.Plane()
  })
  world.addBody(bodyGround)

  const bodyCube = new CANNON.Body({
    mass: 5,
    position: new CANNON.Vec3(0, 7, 0),
    shape: new CANNON.Box(new CANNON.Vec3(.5,.5,.5))
  })
  world.addBody(bodyCube)



  const physics = {
    world: world,
    timeStep: timeStep,
    bodyGround: bodyGround,
    bodyCube: bodyCube
  }

  return physics



}