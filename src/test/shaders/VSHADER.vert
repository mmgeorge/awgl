

/**
 * Vertex shader definitions for a WebGl system
 * Time-stamp: <2016-04-02 15:22:53>
 */

attribute vec4 a_Position;

uniform bool mutable;  

attribute vec4 a_Normal;
uniform vec3 u_Kd; 
uniform mat4 u_MvpMatrix;
uniform mat4 u_ModelMatrix;
uniform mat4 u_NormalMatrix;
varying vec3 v_Kd;            // Phong Lightidd: diffuse reflectance
varying vec4 v_Position; 
varying vec3 v_Normal;

varying vec4 v_Color;
uniform struct GouraudLight {
  vec3 color;
  vec3 position;
  vec3 ambient; 
} gLight[3];


void main(){
  gl_Position = u_MvpMatrix * a_Position;
  v_Position = u_ModelMatrix * a_Position;
}
