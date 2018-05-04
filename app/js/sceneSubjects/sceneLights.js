export function SceneLights(scene) {

  const generalLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.1)
  scene.add(generalLight)

  const ballLight = new THREE.PointLight(0xffffff, 1, 20, 2)
  ballLight.castShadow = true;
  ballLight.position.set(2,10,1)
  scene.add(ballLight)

  const lights = {
    generalLight: generalLight,
    ballLight: ballLight
  }

  return lights
}