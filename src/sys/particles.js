'use strict';

/** Defintiions for a customizable Physics System */
class Physics_Def {
    constructor(args){
	let gravity = args.gravity || -10; 
	this.gravity = new vec3(0,gravity,0); 
    }

    /** Shorthand Accessors */
    get g (){
	return this.gravity; 
    }
}

/** Definitions for a basic Particle system */
class Particle_Sys {
    constructor(scene, count){
	// Public 
	this.particles = [];
	this.forces;
	this.constraints;
	this.index = scene._shaders.length; // Location of shdr in Scene vec
	this.buffer;
	
	//GLSL Hooks
	this._uL_ballShift;
	this._uL_mat4_model;
	this._uL_mat4_mvp;
	
	/** Initialization */
	let gl = scene._gl;
	scene._shaders.push(mk_shader(gl, VSHDR_PARTICLE_SOURCE, FHSDR_PARTICLE_SOURCE)); 
	scene._use_shader(this.index);
	this._uL_ballShift = gl.getUniformLocation(gl.program, 'u_ballShift');
	this._uL_mat4_model = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
	this._uL_mat4_mvp = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
	

	//Pushback new particle
	for (let i = count; i > 0; i--){
	    this.particles.push(new Particle({
		position : new vec3(10*Math.random(1)-50,10*Math.random(1)-40,50*Math.random(1)+10),
		velocity : new vec3(0.15,0.15,0),
		force    : new vec3(0,0,0)}));
	}

	// Buffer setup
	function init_buf(self){
	    // Concat Data
	    let verts = new Float32Array(SIZE_PART*self.particles.length);
	    for (let i=0, j=0; j<self.particles.length; j++){
		verts[i]   = self.particles[j].p.x;
		verts[i++] = self.particles[j].p.y;
		verts[i++] = self.particles[j].p.z;
		verts[i++] = self.particles[j].v.x;
		verts[i++] = self.particles[j].v.y;
		verts[i++] = self.particles[j].v.z;
		verts[i++] = self.particles[j].f.x;
		verts[i++] = self.particles[j].f.y;
		verts[i++] = self.particles[j].f.z;
	    }

	    // Init Buffer
	    let buff = gl.createBuffer();
	    if (!buff) throw new Error("Failed to create particle storage location");
	    gl.bindBuffer(gl.ARRAY_BUFFER, buff);
	    gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);
	    return buff;
	}	
	this.buffer = init_buf(this);
    }

    render(gl, mat4_model, mat4_mvp){
	self = this;
	gl.uniformMatrix4fv(self._uL_mat4_model, false, mat4_model.elements);
	gl.uniformMatrix4fv(self._uL_mat4_mvp, false, mat4_mvp.elements);
	map(function(p){p.draw(gl, self._uL_ballShift);}, self.particles); 
    }
}

var SIZE_PART = 9; 
class Particle {
    constructor(args){
	let position = args.position || vec3.create();
	let velocity = args.velocity || vec3.create(); 
	let force = args.force || vec3.create();
	
	// Public
	this.position = position;
	this.velocity = velocity;
	this.force = force;

	// Private
	this._damping = 0.998; // Remove energy added by degeneracy
	this._mass_inverse;
    }
    
    /** Shorthand Accesors */
    get p (){
	return this.position; 
    }
    set p (v){
	this.position = v; 
    }
    get v (){
	return this.velocity; 
    }
    get f (){
	return this.force;
    }

    draw(gl, uL_ballshift){

	if (this.p.z > -10) this.p.z -= 0.3;
	gl.uniform4f(uL_ballshift,this.p.x,this.p.y,this.p.z,0.0);
	gl.drawArrays(gl.POINTS, 0, 1); 
    }
}

class Force {
    
}

class Constraint {
    
}

/** 
v1 = v0-grav
v1 = v1 * drag
pos1 = pos0 + v1
bounce()
 */

