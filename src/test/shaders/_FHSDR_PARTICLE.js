var FHSDR_PARTICLE_SOURCE=`
/** Fragment shader for a particle system
    Time-stamp: <2016-04-07 16:59:38> */

#ifdef GL_ES
precision mediump float;
#endif

varying vec4 v_Color;

void main(){
    float dist = distance(gl_PointCoord, vec2(0.5,0.5));
    if (dist < 0.5){
	gl_FragColor = vec4((1.0-2.0*dist)*v_Color.rgb, 1.0); 
    }
    else discard; 
}
`;