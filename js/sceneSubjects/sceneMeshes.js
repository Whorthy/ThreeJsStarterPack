function SceneMeshes(scene) {

  const pi = 3.1415

  const groundGeometry = new THREE.PlaneGeometry(200, 200, 4)
  const groundMaterial = new THREE.MeshPhongMaterial({color: 0xffffff, flatshading: true})
  const plane = new THREE.Mesh(groundGeometry, groundMaterial)
  plane.receiveShadow = true
  scene.add(plane)
  plane.rotation.x = - (pi / 2)

  const cubeGeometry = new THREE.BoxGeometry( 1,1,1);
  const cubeMaterial = new THREE.MeshPhongMaterial({color: 0xff0000})
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
  cube.castShadow = true
  scene.add(cube)

  const meshes = {
    plane: plane,
    cube: cube
  }

  return meshes

}