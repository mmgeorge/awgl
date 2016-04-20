'use strict';
// TODO: Pull MKS out to Scene

/** Defintiions for a customizable Physics System */
class Physics_Def {
    constructor(opts){
	let args = opts || {}; 
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
    constructor(scene, pcount){
	this.offset = new vec3(-80,0,30);   /** TEMP */
	
	// Public 
	this.particles =[];
	this.forces = [];
	this.constraints = []; 

	// Private
	this.index = scene._shaders.length; // Location of shdr in Scene vec
	this._buff_glsl;
	this._buff_s0 = new ArrayBuffer(SIZE_PART*FSIZE*pcount);
	
	//GLSL Hooks
	this._uL_mat4_model;
	this._uL_mat4_mvp;
	
	/** Initialization */
	let gl = scene._gl;
	scene._shaders.push(mk_shader(gl, VSHDR_PARTICLE_SOURCE, FHSDR_PARTICLE_SOURCE)); 
	scene._use_shader(this.index);
	this._uL_mat4_model = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
	this._uL_mat4_mvp = gl.getUniformLocation(gl.program, 'u_MvpMatrix');

	// Forces init
	var F_Grav = function(pos){
	    return new vec3([0,0,-0.000098]); 
	};
	
	// Pushback new particle
	for (let i = pcount, j = 0; i > 0; i--, j+=(SIZE_PART*FSIZE)){
	    this.particles.push(new Particle({
		buffer   : this._buff_s0,
		offset   : j,
		position : [random_from_range(-10,10)+this.offset.x,
			    random_from_range(-10,10)+this.offset.y,
			    random_from_range(-10,10)+this.offset.z],
		velocity : [0.0,0.0,0],
		forces   : [F_Grav],
		mass    : 1.0
	    }));
	}
	this._buff_glsl = init_buffer(gl, this._buff_s0, gl.DYNAMIC_DRAW);

	// Pushback ground constraint
	var C_Plane = function(particle){
	    return (particle.p.z <= -10 || particle.p.z >= 60); 
	};
	this.constraints.push(C_Plane);

    }
        
    _solve(dT){
	for (let i=0; i<this.particles.length; i++){
	    for (let j=0; j< this.constraints.length; j++){
		if (this.constraints[j](this.particles[i]) &&
		    this.particles[i].v.z < 0)
		    this.particles[i].v.scale_eq(-1); 
	    }
	    this.particles[i].v.add_eq(this.particles[i].a.scale_eq(dT));
	    this.particles[i].p.add_eq(this.particles[i].v.scale(dT));
	}
    }
    
    /** webgl_context, mat4, mat4 -> nil
        Render the particle system */
    render(gl, dT, mat4_model, mat4_mvp){
	let self = this;
	// Get new context
	this._solve(dT); 
	// Bind & update buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, this._buff_glsl);
	gl.bufferSubData(gl.ARRAY_BUFFER, 0, this._buff_s0); 
	bind_attrib(gl, 'a_Position', 3, gl.FLOAT, FSIZE*SIZE_PART, 0);

	gl.uniformMatrix4fv(self._uL_mat4_model, false, mat4_model.elements);
	gl.uniformMatrix4fv(self._uL_mat4_mvp, false, mat4_mvp.elements);

	gl.drawArrays(gl.POINTS, 0, this.particles.length);
    }
}

var SIZE_PART = 10; 
class Particle {
    constructor(args){
	let buffer = args.buffer;
	let offset = args.offset;
	let position = args.position; 
	let velocity = args.velocity; 
	let forces = args.forces;
	let mass = args.mass;
//	console.log(position);
	// Public
	this.position = new vec3p(buffer, offset, position);
	this.velocity = new vec3p(buffer, offset+(3*FSIZE), velocity);
	this.forces = forces; //new vec3p(buffer, offset+(6*FSIZE), force);

	this.imass_buf = new Float32Array(buffer, offset+(9*FSIZE), 1);
	if (mass) this.imass_buf[0] = 1/mass;
	else this.imass_buf[0] = 0; 

	// Private
	this._damping = 0.998; // Remove energy added by degeneracy
    }

    get imass(){
	return  this.imass_buf[0];
    }

    /** Apply forces to particle */
    get acceleration(){
	let ftot = vec3.create(); 
	for (let i=0; i< this.forces.length; i++){
	    ftot.add_eq(this.forces[i](this.position));	  
	}
	return ftot.scale_eq(this.imass);
    }

    /** Mask for acceleration */
    get a(){
	return this.acceleration; 
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

}

class Force {
    constructor(fn){
	this.fn; 
    }

    apply(particle){
	particle.p.add_eq(this.fn(particle)); 
    }
    
}

/** class Gravity extends Force {
    constructor(){
	this.mass_planet;
	this.center_planet; 
    }
} */

class Constraint {
    constructor(){
	this.fn; // Function for detecting constraints
    }
    check_collision(particle){
	return this.fn(particle);  
    }
}

function random_from_range(x,y){
    return Math.random() * ((y-x) + x); 
}

/** 
v1 = v0-grav
v1 = v1 * drag
pos1 = pos0 + v1
bounce()
 */

/* explicit integrator *such as euler integration s1 = s0 + s0dot h or midpoint method  
velocity verlo shader */
