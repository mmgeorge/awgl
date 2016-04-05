"use strict";
// Additional WebGL Utilities
// Time-stamp: <2016-04-05 14:37:47>

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
