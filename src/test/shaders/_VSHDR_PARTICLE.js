var VSHDR_PARTICLE_SOURCE=`
/** Vertex Shader for a Particle System
    Time-stamp: <2016-04-16 13:37:15> */

#ifdef GL_ES
precision mediump float;
#endif

attribute vec4 a_Position;
varying vec4 v_Color;

uniform mat4 u_MvpMatrix;
uniform mat4 u_ModelMatrix;


void main(){
    gl_PointSize = 10.0;
    gl_Position = u_MvpMatrix * a_Position ;
    v_Color = vec4(0.9,0.1, 0.1, 1.0);
}
`;