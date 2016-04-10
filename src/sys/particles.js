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

/** MKS Unit Conversions */
class MKS {
    constructor(opts){
	let args = opts || {}; 
	let m_d = args.m_d || 1;
	let kg_d = args.kg_d || 1000;
	let s_d = args.s_d || 1000;
	
	// Divisiors
	this.m_d = m_d;
	this.kg_d = kg_d;
	this.s_d = s_d;	
    }

    /** Conversions */
    m(x){
	return x / m_d; 
    }
    kg(x){
	return x / k_d; 
    }
    s(x){
	return x / s_d; 
    }
}

/** Definitions for a basic Particle system */
class Particle_Sys {
    constructor(scene, count){
	// Public 
	this.pS0 = [];
	this.pSOdot =[];
	this.pS1 = []; 

	this.pF0 = []; // Forces
	this.pC0 = []; // Constraints
	
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

	// Initialize measurements
	window.mks = new MKS(); 
	
	//Pushback new particle
	for (let i = count; i > 0; i--){
	    this.pS0.push(new Particle({
		position : new vec3(10*Math.random(1)-50,10*Math.random(1)-40,50*Math.random(1)+10),
		velocity : new vec3(0.15,0.15,0),
		force    : new vec3(0,0,0)}));
	}

	// Buffer setup
	function init_buf(self){
	    // Concat Data
	    let verts = new Float32Array(SIZE_PART*self.pS0.length);
	    for (let i=0, j=0; j<self.pS0.length; j++){
		verts[i]   = self.pS0[j].p.x;
		verts[i++] = self.pS0[j].p.y;
		verts[i++] = self.pS0[j].p.z;
		verts[i++] = self.pS0[j].v.x;
		verts[i++] = self.pS0[j].v.y;
		verts[i++] = self.pS0[j].v.z;
		verts[i++] = self.pS0[j].f.x;
		verts[i++] = self.pS0[j].f.y;
		verts[i++] = self.pS0[j].f.z;
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
	map(function(p){p.draw(gl, self._uL_ballShift);}, self.pS0); 
    }
}

var SIZE_PART = 9; 
class Particle {
    constructor(args){
	let position = args.position || vec3.create();
	let velocity = args.velocity || vec3.create(); 
	let force = args.force || vec3.create();
	let mass = args.mass || 5; 
	
	// Public
	this.position = position;
	this.velocity = velocity;
	this.force = force;
	this.mass = mass; 

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

