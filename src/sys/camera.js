'use strict';

const ORTHOGRAPHIC = 1;
const PERSPECTIVE = 0; 

class Camera{
    constructor(gl, args){
	let mode = args.mode || 0; 
	let perspective = args.perspective || 40;
	let position = args.position || [6,0,0];
	let lookAt = args.lookAt || [0,0,0];
	let up = args.up || [0,0,1];
	
	//public
	this.position = new vec3(position[0], position[1], position[2]);
	this.lookAt = new vec3(lookAt[0],lookAt[1],lookAt[2] );
	this.up = new vec3(up[0],up[1],up[2]);
	this.perspective = perspective; 

	//private
	this._velocity = 0.05;
	this._angle = 3.141592654; //start looking at -x
	this._t_angle = 3.141592654; // for tilt
	this._angle_incr = 0.15; 
	this._dist = vec3.create();

	this._w = false;
	this._s = false;
	this._a = false;
	this._d = false;
	this._q = false;
	this._e = false;
	this._r = false;
	this._f = false;
	this._moving = false;
	this._direction = vec3.create();

	this._uL_position = gl.getUniformLocation(gl.program, 'u_eyePosWorld');
	if(!this._uL_position) throw new Error("Failed to get camera storage location");

	
	gl.uniform3fv(this.uL_position, this.position.elements);
    }

    _mat4_proj(gl, mode){
	let mat4_proj = new Matrix4();
	let zoom = 5;
	let vpAspect = (gl.drawingBufferWidth)/(gl.drawingBufferHeight); 
	switch (mode){
	case PERSPECTIVE:
	    mat4_proj.setPerspective(this.perspective,
				     vpAspect,
				     1, 1000);
	    return mat4_proj; 
	case ORTHOGRAPHIC:
	    if (vpAspect >= 1){ //When width > height
		mat4_proj.setOrtho(-vpAspect*zoom, vpAspect*zoom,
  				    -zoom, zoom, 	               
  				    1, 100);			 	
	    } else {
		mat4_proj.setOrtho(-zoom, zoom, 	   	
  				    -1/vpAspect*zoom, 1/vpAspect*zoom, 		 
  				    1, 100);			
	    }
	    return mat4_proj; 
	}
    }
    
    _mat4_view(){
	let mat4_view = new Matrix4();
	mat4_view.setLookAt(
	    this.position.elements[0],this.position.elements[1],this.position.elements[2],
	    this.lookAt.elements[0],this.lookAt.elements[1],this.lookAt.elements[2],
	    this.up.elements[0],this.up.elements[1],this.up.elements[2]);
	return mat4_view; 
    }

    mat4_VP(gl, mode,  dT){
	let vpAspect = (gl.drawingBufferWidth)/(gl.drawingBufferHeight);
	let mat4_VP;
	
	switch (mode){
	case PERSPECTIVE:
	    this.update(gl, dT);
	    mat4_VP = this._mat4_proj(gl, PERSPECTIVE ).concat(this._mat4_view());
	    return mat4_VP;
	case ORTHOGRAPHIC:
	    this.update(gl, dT);
	    mat4_VP = this._mat4_proj(gl, ORTHOGRAPHIC).concat(this._mat4_view());
	    return mat4_VP;
	}
    }

    keyPressed(key){
	switch( key){
	case 87:
	    this._w = true;
	    break;
	case 65:
	    this._a = true;
	    break; 
	case 83:
	    this._s = true;
	    break;
	case 68:
	    this._d = true;
	    break;
	case 81:
	    this._q = true;
	    break;
	case 69:
	    this._e = true;
	    break;
	case 82:
	    this._r = true;
	    break;
	case 70:
	    this._f = true;
	    break;
	}
    }

    keyUp(){
	    this._w = false;
	    this._a = false;
	    this._s = false;
	    this._d = false;
	    this._q = false;
	    this._e = false;
	    this._r = false;
	    this._f = false;
    }

    update(gl, dT){
	let pi = 3.141592654
	let vel = this._velocity*dT;
	let angle_step = this._angle_incr*vel*0.3;
	this._dist = vec3.create();
	if (this.moving){
	    if (this._w){        
		this._dist = vec3.multiply(vec3.subtract(this.lookAt,this.position), vel);
		this.position = vec3.add(this.position, this._dist);
		this.lookAt = vec3.add(this.lookAt, this._dist);

	    }  if (this._a) { 
		this._dist = vec3.subtract(this.lookAt,this.position);
		let len = Math.sqrt(this._dist.elements[0]*this._dist.elements[0] +
				    this._dist.elements[1]*this._dist.elements[1]);
		
		this._angle += (angle_step);
		this.lookAt.elements[0] = this.position.elements[0] + (len * Math.cos(this._angle));
		this.lookAt.elements[1] = this.position.elements[1] + (len * Math.sin(this._angle));
		
	    }  if (this._s) { 
		this._dist = vec3.multiply(vec3.subtract(this.lookAt,this.position), vel);
		this.position = vec3.subtract(this.position, this._dist);
		this.lookAt = vec3.subtract(this.lookAt, this._dist);

	    }  if (this._d) { 
		this._dist = vec3.subtract(this.lookAt,this.position);
		let len = Math.sqrt(this._dist.elements[0]*this._dist.elements[0] +
				    this._dist.elements[1]*this._dist.elements[1]);
	
		this._angle -= (angle_step);
		this.lookAt.elements[0] = this.position.elements[0] + (len * Math.cos(this._angle));
		this.lookAt.elements[1] = this.position.elements[1] + (len * Math.sin(this._angle));
		
	    }  if (this._q) { 
		vel = vel * 8;
		this._dist.elements[0] = vel*Math.cos(this._angle+(3 * pi/2));
		this._dist.elements[1] =  vel*Math.sin(this._angle+(3 * pi/2));
		this.position = vec3.subtract(this.position, this._dist);
		this.lookAt = vec3.subtract(this.lookAt, this._dist);

	    }  if (this._e) {
		vel = vel * 8;
		this._dist.elements[0] = vel*Math.cos(this._angle+(pi/2));
		this._dist.elements[1] =  vel*Math.sin(this._angle+(pi/2));
		this.position = vec3.subtract(this.position, this._dist);
		this.lookAt = vec3.subtract(this.lookAt, this._dist);
		
	    }  if (this._r) { 
		this._dist = vec3.subtract(this.lookAt,this.position);
		let len = Math.sqrt(this._dist.elements[0]*this._dist.elements[0] +
				    this._dist.elements[1]*this._dist.elements[1]);
		if(this._t_angle <= (2.1)){
		    this._t_angle = 2.1; 
		} else {
		    this._t_angle -= (angle_step);
		}
		this.lookAt.elements[2] = this.position.elements[2] + (len * Math.sin(this._t_angle));
		
	    }  if (this._f) { 
		this._dist = vec3.subtract(this.lookAt,this.position);
                let len = Math.sqrt(this._dist.elements[0]*this._dist.elements[0] +
				    this._dist.elements[1]*this._dist.elements[1]);

		this._t_angle += (angle_step);

		if(this._t_angle >= (4.3)){
		    this._t_angle = 4.3; 
		} else {
		    this._t_angle += (angle_step);
		}		
		this.lookAt.elements[2] = this.position.elements[2] + (len * Math.sin(this._t_angle));	    }
	    gl.uniform3fv(this._uL_position, this.position.elements);
	}


    }

}
