'use strict';
class Material {
    constructor(gl, num, ke, ka, kd, ks, kshiny){
	this.gl = gl;
	this.ke = ke;
	this.ka = ka;
	this.kd = kd; 
	this.ks = ks;
	this.kshiny = kshiny;
	this.uLoc_ke = gl.getUniformLocation(gl.program, 'material[' + num + '].Ke');
	this.uLoc_ka = gl.getUniformLocation(gl.program, 'material[' + num + '].Ka');
	this.uLoc_kd = gl.getUniformLocation(gl.program, 'material[' + num + '].Kd');
	this.uLoc_ks = gl.getUniformLocation(gl.program, 'material[' + num + '].Ks');
	this.uLoc_kshiny = gl.getUniformLocation(gl.program, 'material[' + num + '].Kshiny');
	if(!this.uLoc_ke || !this.uLoc_ka || !this.uLoc_kd || !this.uLoc_ks || !this.uLoc_kshiny){
	    throw new Error('Failed to get the Phong Reflectance storage locations');
	}
	this.update({all:1});
    }
    set(options){
	var options = options || {};
	var ke = options.ke || false;
	var ka = options.ka || false;
	var kd = options.kd || false;
	var ks = options.ks || false;
	var kshiny = options.kshiny || false;
	if (ke){
	    this.ke = ke;
	    this.gl.uniform3fv(this.uLoc_ke, this.ke);  
	}
	if (ka){
	    this.ka = ka; 
	    this.gl.uniform3fv(this.uLoc_ka, this.ka);
	}
	if (kd){
	    this.kd = kd;
	    this.gl.uniform3fv(this.uLoc_kd, this.kd);
	}
	if (ka){
	    this.ks = ks; 
	    this.gl.uniform3fv(this.uLoc_ks, this.ks);
	}
	if (kshiny){
	    this.kshiny = kshiny;
	    this.gl.uniform1i(this.uLoc_kshiny, this.kshiny);
	}
    }
    update(options){
	var options = options || {};
	var all = options.all || false;
	var ke = options.ke || false;
	var ka = options.ka || false;
	var kd = options.kd || false;
	var ks = options.kd || false;
	var kshiny = options.kshiny || false;
	if (all){
	    this.gl.uniform3fv(this.uLoc_ke, this.ke); 
	    this.gl.uniform3fv(this.uLoc_ka, this.ka);	
	    this.gl.uniform3fv(this.uLoc_kd, this.kd);
	    this.gl.uniform3fv(this.uLoc_ks, this.ks);	
	    this.gl.uniform1i(this.uLoc_kshiny, this.kshiny);
	}	    
	else {
	    if (ke){
		this.gl.uniform3fv(this.uLoc_ke, this.ke);  
	    }
	    if (ka){
		this.gl.uniform3fv(this.uLoc_ka, this.ka);
	    }
	    if (kd){
		this.gl.uniform3fv(this.uLoc_kd, this.kd);
	    }
	    if (ka){
		this.gl.uniform3fv(this.uLoc_ks, this.ks);
	    }
	    if (kshiny){
		this.gl.uniform1i(this.uLoc_kshiny, this.kshiny);
	    }
	}
    }
}
