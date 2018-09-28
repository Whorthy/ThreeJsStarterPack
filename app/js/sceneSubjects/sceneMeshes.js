import glsl from 'glslify'

export function SceneMeshes(scene) {

  const pi = 3.1415

  const groundGeometry = new THREE.PlaneGeometry(100, 100, 4)
  const groundMaterial = new THREE.MeshPhongMaterial({color: 0xffffff, flatshading: true})
  const plane = new THREE.Mesh(groundGeometry, groundMaterial)
  plane.receiveShadow = true
  scene.add(plane)
  plane.rotation.x = - (pi / 2)

  const cubeGeometry = new THREE.BoxBufferGeometry( 1,1,1);
  const cubeMaterial = new THREE.ShaderMaterial({
    vertexShader: glsl.file('../../shaders/vertexShader'),
    fragmentShader: glsl.file('../../shaders/fragmentShader')
  })
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)

  let displacement = new Float32Array(cube.geometry.attributes.position.count)
  cubeGeometry.addAttribute('displacement', new THREE.BufferAttribute(displacement, 1))
  for ( let i = 0; i < cube.geometry.attributes.position.count; i++ ) {
    displacement[i] = Math.random() * .2
  }

  cube.castShadow = false
  scene.add(cube)

  const meshes = {
    plane: plane,
    cube: cube
  }

  return meshes

}