"use strict";
// Additional WebGL Utilities
// Time-stamp: <2016-03-20 17:52:43>


Array.prototype.equals = function(arr){
    if (this.length != arr.length) return false; 
    for (var i =0; i<this.length; i++){
	if (this[i] != arr[i]) return false; 
    }
    return true;
}

/** 
    * Initialize the array buffers for a given attribute
    * @param gl context
    * @param attribute
    * @param data
    * @param type
    * @param num
    * @return boolean
    */


function initArrayBuffer(gl, method, attribute, data, num, type, stride, offset) {
  var buffer = gl.createBuffer();   // Create a buffer object
  if (!buffer) {
    console.log('Failed to create the buffer object');
    return false;
  }
    
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, method);
  // Assign the buffer object to the attribute variable
  var a_attribute = gl.getAttribLocation(gl.program, attribute);
  if (a_attribute < 0) {
    console.log('Failed to get the storage location of ' + attribute);
    return false;
  }
  gl.vertexAttribPointer(a_attribute, num, type, false, stride, offset);
  // Enable the assignment of the buffer object to the attribute variable
  gl.enableVertexAttribArray(a_attribute);

    return true;
}
/** 
    * Subtract two vectors
    * @param vector va 
    * @param vector vb
    * @return vector: va - vb
    */
function subtract(va, vb){
    var tmp = new Float32Array([0,0,0]);
    for (var x=0; x<va.length; x++){
	tmp[x]=va[x]-vb[x];
    }
    return tmp; 
}

/** 
    * Multiplication by scalar
    * @param vector va
    * @param scalar s
    * @return vector: va*s
    */
function multiS(va, s){
    for (var x=0; x<va.length; x++){
	va[x]*=s;
    }
    return va; 
}

/** 
    * Addition by scalar
    * @param vecotr va
    * @param scalar s
    * @return vector: va+s
    */
function addS(va, s){
    for (var x=0; x<va.length; x++){
	va[x]+=s;
    }
    return va; 
}

/** 
    * Cross product of two vectors
    * @param vector l1 (len3)
    * @param vector l2 (len3)
    * @return vector: l1 x l2
    */
function crossProduct(l1, l2){
    return new Float32Array([((l1[1]*l2[2])-(l2[1]*l1[2])),
			 -((l1[0]*l2[2])-(l1[2]*l2[0])),
			 ((l1[0]*l2[1])-(l1[1]*l2[0]))]);
}

/** 
    * Generate the normals given a set of vertexColors (len 6) and
    * a indicies buffer
    * @param vector v_vc
    * @param vector v_ind
    * @param int mode: 0 for TRIANGLE_STRIP
    * @return vector: normals
    */
function getNormals(v_vc, v_ind, mode){
    var n = 0;
    var normals = []

    if (mode ==0){
	// TRIANGLE_STRIP
	for (var i = 0; i< v_ind.length; i++){
	    let index = v_ind[i]*3;

	    let point1 = new vec3(v_vc[index],v_vc[index+1],v_vc[index+2]); 
	    let point2 = new vec3(v_vc[index+3],v_vc[index+4],v_vc[index+5]); 
	    let point3 = new vec3(v_vc[index+6],v_vc[index+7],v_vc[index+8]); 

	    let lineA =  vec3.subtract(point1, point3);
	    let lineB =  vec3.subtract(point2, point3);

	    let CP = vec3.normalize(vec3.cross(lineA, lineB));
	    normals.push(CP.elements[0]);
	    normals.push(CP.elements[1]);
	    normals.push(CP.elements[2]);

	//    console.log(CP.elements)
	}
	return normals; 

    } else {
	throw new Error('Warning: Invalid mode selected for getNormals!');
    }
    
}

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


class quat4 {
    constructor(vec, w){
	this.x = vec.elements[0];
	this.y = vec.elements[1];
	this.z = vec.elements[2];
	this.w = w
    }
    
    static toAxisAngle(vec, angleDeg) {
	//--------------------------------------
	// Good tutorial on rotations; code inspiration at:
	//http://www.euclideanspace.com/maths/geometry/rotation
	//                          /conversions/angleToQuaternion/index.htm
	// Be sure we have a normalized x,y,z 'axis' argument before we start:
	let ax = vec.elements[0], ay = vec.elements[1], az = vec.elements[2];
	let mag2 = ax*ax + ay*ay + az*az;	// axis length^2
	let quat4_tmp = new quat4(new vec3(0,0,0), 0); 
	if(mag2-1.0 > 0.0000001 || mag2-1.0 < -0.0000001) {
	    var normer = 1.0/Math.sqrt(mag2);
	    ax *= normer;
	    ay *= normer;
	    az *= normer;
	}

	let halfAngle = angleDeg * Math.PI / 360.0;	// (angleDeg/2) * (2*pi/360)
	let s = Math.sin( halfAngle );
	quat4_tmp.x = ax * s;
	quat4_tmp.y = ay * s;
	quat4_tmp.z = az * s;
	quat4_tmp.w = Math.cos( halfAngle );
	return quat4_tmp;
    }
    
    static inverse(quat){
	return new quat4((new vec3(quat.x*=-1, quat.y*=-1, quat.z*=1)), quat.w)
    }

    static multiply( q1, q2 ){
	let quat4_tmp = new quat4(new vec3(0,0,0), 0);
		quat4_tmp.x =  q1.x * q2.w + q1.y * q2.z - q1.z * q2.y + q1.w * q2.x;
		quat4_tmp.y = -q1.x * q2.z + q1.y * q2.w + q1.z * q2.x + q1.w * q2.y;
		quat4_tmp.z =  q1.x * q2.y - q1.y * q2.x + q1.z * q2.w + q1.w * q2.z;
		quat4_tmp.w = -q1.x * q2.x - q1.y * q2.y - q1.z * q2.z + q1.w * q2.w;
		return quat4_tmp;

    }
    
    static multiplyVec3 ( quat, vec ) {
	let vec3_tmp = new vec3(0,0,0);
	let x = vec.elements[0],  y  = vec.elements[1],  z  = vec.elements[2],
	    qx = quat.x, qy = quat.y, qz = quat.z, qw = quat.w;
	
	// calculate quat * vec:
	let ix =  qw * x + qy * z - qz * y,
	    iy =  qw * y + qz * x - qx * z,
	    iz =  qw * z + qx * y - qy * x,
	    iw = -qx * x - qy * y - qz * z;
	// calculate result * inverse quat:
	vec3_tmp.elements[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
	vec3_tmp.elements[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
	vec3_tmp.elements[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
	return vec3_tmp;
    }
    
    normalize(){
	var len = Math.sqrt(this.x * this.x + 
			    this.y * this.y + 
			    this.z * this.z + 
			    this.w * this.w );
	if ( len === 0 ) {
	    this.x = 0;
	    this.y = 0;
	    this.z = 0;
	    this.w = 0;
	} 
	else {
	    len = 1 / len;
	    this.x = this.x * len;
	    this.y = this.y * len;
	    this.z = this.z * len;
	    this.w = this.w * len;
	}
	return this;
    }
    length(){
	return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w );
    }
    
}
