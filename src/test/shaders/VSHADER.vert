

/**
 * Vertex shader definitions for a WebGl system
 * Time-stamp: <2016-04-07 15:23:24>
 */

attribute vec4 a_Position;

uniform bool mutable;  

attribute vec4 a_Normal;
uniform vec3 u_Kd; 
uniform mat4 u_MvpMatrix;
uniform mat4 u_ModelMatrix;
uniform mat4 u_NormalMatrix;
varying vec3 v_Kd;            
varying vec4 v_Position; 
varying vec3 v_Normal;


void main(){
    gl_Position = u_MvpMatrix * a_Position;
    v_Position = u_ModelMatrix * a_Position;
}
