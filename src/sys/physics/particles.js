'use strict';
// TODO: Pull MKS out to Scene
//       Implement Force functions as eval("function") to gain
//       better locality.

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
	this.offset = new vec3(-80,0,20);   /** TEMP */
	
	// Public 
	this.particles =[];
	this.forces = [];
	this.constraints = [];
	this.solver = 1;

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
	var A = []; var B = []; 
	for (let i = pcount, j = 0; i > 0; i--, j+=(SIZE_PART*FSIZE)){
	    let part = new Particle({
		buffer   : this._buff_s0,
		offset   : j,
		position : [random_from_range(-10,10)+this.offset.x,
			    random_from_range(-10,10)+this.offset.y,
			    random_from_range(-10,10)+this.offset.z],
		velocity : [0.0,0.0,0],
		mass    : 1.0
	    });
	    if (i % 2) A.push(part);
	    else B.push(part);
	    
	    this.particles.push(part); 
	}
	this.forces.push(new F_Grav(this.particles));
	this.forces.push(new F_Spring(1, [1,1,1], A, B)); 
	this._buff_glsl = init_buffer(gl, this._buff_s0, gl.DYNAMIC_DRAW);

	// Pushback ground constraint
	var C_Plane = function(particle){
	    return (particle.p.z <= -10 || particle.p.z >= 60); 
	};
	this.constraints.push(C_Plane);

    }
        
    _solve(dT){
	dT = dT/10000;
	
	// Apply Forces
	for (let i=0; i<this.forces.length; i++)
	    this.forces[i].apply();

	// Apply Constraints
	for (let i=0; i<this.particles.length; i++){
	    for (let j=0; j< this.constraints.length; j++){
		if (this.constraints[j](this.particles[i]) &&
		    this.particles[i].v.z < 0)
		    this.particles[i].v.scale_eq(-1); 
	    }
	}
	// Integrate
	switch(this.solver){
	case 0: // Euler
	    for (let i=0; i<this.particles.length; i++){
		this.particles[i].v.add_eq(this.particles[i].a.scale_eq(dT));
		this.particles[i].p.add_eq(this.particles[i].v.scale(dT));
	    }
	    break;
	case 1: // Midpoint
	    for (let i=0; i<this.particles.length; i++){
		// Store s1ss
		let t_v1 = this.particles[i].v.add(this.particles[i].a.scale_eq(dT/2));
	//	let t_p1 = this.particles[i].p.add(this.particles[i].v.scale(dT/2));
		// Calculate sMdot as (s1/2)dot, add it
		this.particles[i].v.add_eq(this.particles[i].a.scale_eq(dT));
		this.particles[i].p.add_eq(t_v1.scale_eq(dT));
		
	    }
	    break;
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
	let mass = args.mass;
//	console.log(position);
	// Public
	this.position = new vec3p(buffer, offset, position);
	this.velocity = new vec3p(buffer, offset+(3*FSIZE), velocity);
	this.ftot = new vec3p(buffer, offset+(6*FSIZE), [0,0,0]);

	this.imass_buf = new Float32Array(buffer, offset+(9*FSIZE), 1);
	if (mass) this.imass_buf[0] = 1/mass;
	else this.imass_buf[0] = 0; 

	// Private
	this._damping = 0.998; // Remove energy added by degeneracy
    }

    get imass(){
	return  this.imass_buf[0];
    }

    /** Mask for acceleration */
    get a(){
	return this.ftot.scale(this.imass); 
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
	this._fn;
	this._parts;
    }

    apply(){
	this._fn();  
    }
    
}

class F_Grav extends Force {
    constructor(parts){
	let self = super();
	self._parts = parts; 
	self._grav = new vec3([0,0,-9.8]); 
	self._fn = function(){
	    for (let i=0; i< this._parts.length; i++){
		this._parts[i].ftot.add_eq(this._grav); 
	    }
	};
    }
}

class F_Spring extends Force {
    constructor(k, length, A, B){
	let self = super();
	self._k = k;
	self._length = new vec3(length);
	self._parts = A; 
	self._B = B;
	self._fn = function(){	    
	    for (let i=0; i< self._parts.length; i++){
		let F =
		    vec3p.sub(
			vec3p.sub(
			    self._parts[i].position,
			    self._B[i].position),
			self._length)
		    .scale_eq(self._k);
		self._parts[i].ftot.sub_eq(F);
		self._B[i].ftot.add_eq(F);
	    }
	};
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


