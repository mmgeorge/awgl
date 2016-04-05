"use strict";
// Additional WebGL Utilities
// Time-stamp: <2016-04-05 14:37:21>

class vec3 {
    constructor(x,y,z){
	this.elements = new Float32Array(3);
	this.elements[0] = x;
	this.elements[1] = y;
	this.elements[2] = z;
    }

    static create(){
	return new vec3(0,0,0);
    }

    static length(vec){
	vec = vec.elements;
	let len = Math.sqrt(vec[0]*vec[0] + vec[1]*vec[1] + vec[2]*vec[2]);
	return len; 
    }
    
    static normalize(vec){
	vec = vec.elements; 
	let len = Math.sqrt(vec[0]*vec[0] + vec[1]*vec[1] + vec[2]*vec[2]);
	return new vec3(vec[0]/len, vec[1]/len, vec[2]/len);
    }
    
    static cross(l1,l2){
	l1 = l1.elements;
	l2 = l2.elements; 
	return new vec3(
	    ((l1[1]*l2[2])-(l2[1]*l1[2])),
	   -((l1[0]*l2[2])-(l1[2]*l2[0])),
	    ((l1[0]*l2[1])-(l1[1]*l2[0])));
    }
    
    static add(va, vb){
	var tmp = new Float32Array(3);
	for (var x=0; x<3; x++){
	    tmp[x]=va.elements[x]+vb.elements[x];
	}
	return new vec3(tmp[0], tmp[1], tmp[2]);
    }
    
    static subtract(va, vb){
	let tmp = new Float32Array(3);
	for (let x=0; x<3; x++){
	    tmp[x]=va.elements[x]-vb.elements[x];
	}
	return new vec3(tmp[0], tmp[1], tmp[2]);
    }

    static multiply(va, scalar){
	let tmp = new Float32Array(3);
	for (let x=0; x<3; x++){
	    tmp[x] = va.elements[x] * scalar;
	}
	return new vec3(tmp[0], tmp[1], tmp[2]);
    }
}
