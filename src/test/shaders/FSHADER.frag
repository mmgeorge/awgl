


/**
 * Fragment shader definitions for a WebGl system
 * Time-stamp: <2016-03-20 15:02:11>
 */

#ifndef READ_SRC // Suppress errors
#define NUM_LIGHTS 3
#define NUM_MATERIALS 3
#endif

#extension GL_OES_standard_derivatives : enable

#ifdef GL_ES
precision mediump float;
#endif

uniform vec3 u_eyePosWorld;   // Camera/eye location in world coords.
varying vec3 v_Normal;
varying vec4 v_Position;
varying vec3 v_Kd;            // Find diffuse reflectance K_d per pix
uniform int u_matIndex;
uniform int u_mode; 

uniform struct Material{
  vec3 Ke;     	// Phong Reflectance: emissive
  vec3 Ka;    	// Phong Reflectance: ambient
  vec3 Ks;     	// Phong Ref lectance: specular
  vec3 Kd;      // Find diffuse reflectance K_d per pix
  int Kshiny;
} material[NUM_MATERIALS];

uniform struct Light {
  vec3 position;
  vec3 ambient;
  vec3 diffuse;
  vec3 specular;
} light[NUM_LIGHTS];


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
      
      float rDotV = max(dot(R, V), 0.0);       // phong

      float e = pow(rDotV, float(material[j].Kshiny)); //phong
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


void main(){
  gl_FragColor = vec4(lighting_phong(u_matIndex,v_Position.xyz,find_normal()),1.0);
}
