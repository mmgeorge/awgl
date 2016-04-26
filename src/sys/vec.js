"use strict";
// Additional WebGL Utilities
// Time-stamp: <2016-04-25 20:07:18>


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

    static sub(va, b){
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

    scale_eq (scalar){
	this.x *= scalar;
	this.y *= scalar;
	this.z *= scalar;
	return this;
    }
    
    add_eq(vec){
	this.x += vec.x;
	this.y += vec.y;
	this.z += vec.z; 
    }

    static dot(va, vb){
	return va.x*vb.x + va.y*vb.y + va.z*vb.z; 
    }

    transform(mat){
	// mat3 transform
	if (mat.data.length = 9){
	    this.x = this.x*mat.data[0] + this.y*mat.data[1] + this.z*mat.data[2];
	    this.y = this.x*mat.data[3] + this.y*mat.data[4] + this.z*mat.data[5];
	    this.z = this.x*mat.data[6] + this.y*mat.data[7] + this.z*mat.data[8];
	}
	// mat4 transform
	else {
	    this.x = this.x*mat.data[0] + this.y*mat.data[1] + this.z*mat.data[2] + data[3];
	    this.y = this.x*mat.data[4] + this.y*mat.data[5] + this.z*mat.data[6] + data[7];
	    this.z = this.x*mat.data[8] + this.y*mat.data[9] + this.z*mat.data[10] + data[11];
	}
    }

    
    
}

class vec3p {
    constructor(buff,offset,init){
	this.data = new Float32Array(buff, offset, 3);
	this.data[0] = init[0];
	this.data[1] = init[1];
	this.data[2] = init[2];
    }
    
    get x (){
	return this.data[0];
    }

    set x (v){
	this.data[0] = v; 
    }
    
    get y (){
	return this.data[1];
    }

    set y (v){
	this.data[1] = v; 
    }
    
    get z (){
	return this.data[2];
    }

    set z (v){
	this.data[2] = v; 
    }

    get xyz(){
	return this.data; 
    }

    static sub (a,b){
	return new vec3(
	    a.x - b.x,
	    a.y - b.y,
	    a.z - b.z
	); 
    }
    
    add_eq (vec){
	this.x += vec.x;
	this.y += vec.y;
	this.z += vec.z;
    }

    add (vec){
	return new vec3(
	    this.x + vec.x,
	    this.y + vec.y,
	    this.z + vec.z
	);
    }
    
    sub_eq (vec){
	this.x -= vec.x;
	this.y -= vec.y;
	this.z -= vec.z;
    }

    scale_eq (scalar){
	this.x *= scalar;
	this.y *= scalar;
	this.z *= scalar;
    }

    scale(scalar){
	let nx = this.x * scalar;
	let ny = this.y * scalar;
	let nz = this.z * scalar;
	
	return new vec3(nx,ny,nz); 
    }

    transform(mat){
	// mat3 transform
	if (mat.data.length = 9){
	    this.x = this.x*mat.data[0] + this.y*mat.data[1] + this.z*mat.data[2];
	    this.y = this.x*mat.data[3] + this.y*mat.data[4] + this.z*mat.data[5];
	    this.z = this.x*mat.data[6] + this.y*mat.data[7] + this.z*mat.data[8];
	}
	// mat4 transform
	else {
	    this.x = this.x*mat.data[0] + this.y*mat.data[1] + this.z*mat.data[2] + data[3];
	    this.y = this.x*mat.data[4] + this.y*mat.data[5] + this.z*mat.data[6] + data[7];
	    this.z = this.x*mat.data[8] + this.y*mat.data[9] + this.z*mat.data[10] + data[11];
	}
    }

}
