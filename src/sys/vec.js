"use strict";
// Additional WebGL Utilities
// Time-stamp: <2016-04-07 20:36:43>


class vec3 {
    constructor(x,y,z){
	// Constructor overload 
	if (typeof x === "object") {
	    this.elements = x; 
	} else {
	    this.elements = new Float32Array(3);
	    this.elements[0] = x;
	    this.elements[1] = y;
	    this.elements[2] = z;
	}
    }

    get x (){
	return this.elements[0];
    }

    set x (v){
	this.elements[0] = v; 
    }

    
    get y (){
	return this.elements[1];
    }

    set y (v){
	this.elements[1] = v; 
    }
    
    get z (){
	return this.elements[2];
    }

    set z (v){
	this.elements[2] = v; 
    }

    get xyz(){
	return this.elements; 
    }
    
    static create(){
	return new vec3(0,0,0);
    }

    static inverse(vec){
	return new vec3(map(op('*', -1), vec.xyz));
    }
    
    static length(vec){
	return Math.sqrt(reduce(function(x,y){return x+y}, map(op('pow', 2), vec.xyz))); 
    }
    
    static normalize(vec){
	return new vec3(map(op('/', vec3.length(vec)), vec.xyz)); 
    }
    
    static cross(l1,l2){
	l1 = l1.elements;
	l2 = l2.elements; 
	return new vec3(
	    ((l1[1]*l2[2])-(l2[1]*l1[2])),
	   -((l1[0]*l2[2])-(l1[2]*l2[0])),
	    ((l1[0]*l2[1])-(l1[1]*l2[0])));
    }
    
    static add(va, b){
	// Vector addition 
	if (typeof b === "object") {
	    var tmp = new Float32Array(3);
	    for (var x=0; x<3; x++){
		tmp[x]=va.elements[x]+b.elements[x];
	    }
	    return new vec3(tmp[0], tmp[1], tmp[2]);
	}
	// Scalar addition
	else {
	    return new vec3(map(op("+", b), va.xyz)); 
	}
    }
    
    static subtract(va, b){
	// Vector subtraction
	if (typeof b === "object") {
	    let tmp = new Float32Array(3);
	    for (let x=0; x<3; x++){
		tmp[x]=va.elements[x]-b.elements[x];
	    }
	    return new vec3(tmp[0], tmp[1], tmp[2]);
	}
	// Scalar subtraction
	else {
	   return new vec3(map(op("-", b), va.xyz));    
	}
    }

    static scale(vec, scalar){
	return new vec3(map(op('*',scalar), vec.xyz)); 
    }
}
