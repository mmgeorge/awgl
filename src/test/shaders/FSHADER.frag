
/**
 * Fragment shader definitions for a WebGl system
 * Time-stamp: <2016-04-07 15:32:51>
 */

#ifndef READ_SRC // Suppress GLSLValidator Errors
#define NUM_LIGHTS 3
#define NUM_MATERIALS 3
#endif

#extension GL_OES_standard_derivatives : enable

#ifdef GL_ES
precision mediump float;
#endif

/** Blinn Phong Definitions */
uniform vec3 u_eyePosWorld;   
varying vec3 v_Normal;
varying vec4 v_Position;
varying vec3 v_Kd;            
uniform int u_matIndex;

uniform struct Material{
    vec3 Ke;      // Emmisive Term
    vec3 Ka;      // Ambient Term
    vec3 Ks;      // Specular Term
    vec3 Kd;      // Diffuse Term
    int Kshiny;
} material[NUM_MATERIALS];

uniform struct Light {
    vec3 position;
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
} light[NUM_LIGHTS];

/** @Methods */
vec3 find_normal(){
    vec3 dx = dFdx(v_Position.xyz);
    vec3 dy = dFdy(v_Position.xyz);
    return normalize(cross(dx, dy));
}

vec3 lighting_phong(int n_mat, vec3 pos, vec3 N){
    vec3 emissive, ambient, diffuse, speculr;
    for (int i=0; i<NUM_LIGHTS; i++){
	for (int j=0; j<=NUM_MATERIALS; j++){ // Workaround for const int access
	    if (j != n_mat) continue;
	    vec3 L = normalize(light[i].position - pos.xyz);
	    float lambertian = max(dot(L, N), 0.0); 

	    vec3 R = reflect(-L, N);
	    vec3 V = normalize(u_eyePosWorld - pos.xyz);
      
	    float rDotV = max(dot(R, V), 0.0);       

	    float e = pow(rDotV, float(material[j].Kshiny));
	    e*=e;  //e128
	    e*=e;  //e256

	    emissive += material[j].Ke;
	    ambient += light[i].ambient * material[j].Ka;
	    diffuse += light[i].diffuse * material[j].Kd * lambertian;
	    speculr += light[i].specular * material[j].Ks * e;
	}
    }
    return emissive + ambient + diffuse + speculr;
}

/** @Entry */
void main(){
    gl_FragColor = vec4(lighting_phong(u_matIndex,v_Position.xyz,find_normal()),1.0);
}
