'use strict';
class Light {
    constructor(gl, index, light_sys, light){
	let position = light.pos  || false;
	let ambient  = light.ambi || false;
	let diffuse  = light.diff || false;
	let specular = light.spec || false;

	//public
	this.position = position;
	this.ambient = ambient;
	this.diffuse = diffuse;
	this.specular = specular;

	//private
	this._light_sys = light_sys;

	this._uL_position = gl.getUniformLocation(gl.program,'light['+index+'].position');
	this._uL_ambient = gl.getUniformLocation(gl.program,'light['+index+ '].ambient');
	this._uL_diffuse = gl.getUniformLocation(gl.program,'light['+index+'].diffuse');
	this._uL_specular = gl.getUniformLocation(gl.program,'light['+index+'].specular');
	if(!this._uL_position || !this._uL_ambient || !this._uL_diffuse || !this._uL_specular) {
	    throw new Error("Failed to get light storage locations");
	}

	this.update(gl, {all:1});

    }

    set(options){
	var options = options || {};
	var position = options.position || false;
	var ambient = options.ambient || false;
	var diffuse = options.diffuse || false;
	var specular = options.specular || false;
	if (position){
	    this.position = position;
	    this.gl.uniform3fv(this._uL_position, this.position);
	}
	if (ambient){
	    this.ambient = ambient;
	    this.gl.uniform3fv(this._uL_ambient, this.ambient);
	}
	if (diffuse){
	    this.diffuse = diffuse;
	    this.gl.uniform3fv(this._uL_diffuse, this.diffuse);
	}
	if (specular){
	    this.specular = specular;
	    this.gl.uniform3fv(this._uL_specular, this.specular);
	}
    }
    
    update(gl, options){
	var options = options || {};
	var all = options.all || false;
	var position = options.position || false;
	var ambient = options.ambient || false;
	var diffuse = options.diffuse || false;
	var specular = options.specular || false;
	if (all){
	    gl.uniform3fv(this._uL_position, this.position); 
	    gl.uniform3fv(this._uL_ambient, this.ambient);	
	    gl.uniform3fv(this._uL_diffuse, this.diffuse);	
	    gl.uniform3fv(this._uL_specular, this.specular);
	}	    
	else {
	    if (position){
		gl.uniform3fv(this._uL_position, this.position);
	    }
	    if (ambient){
		gl.uniform3fv(this._uL_ambient, this.ambient);
	    }
	    if (diffuse){
		gl.uniform3fv(this._uL_diffuse, this.diffuse);
	    }
	    if (specular){
		gl.uniform3fv(this._uL_specular, this.specular);
	    }
	}
    }
}
