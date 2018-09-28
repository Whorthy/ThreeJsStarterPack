varying vec3 vNormal;
attribute float displacement; 

void main() {

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}