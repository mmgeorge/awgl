'use strict';


/** Defintiions for a customizable Physics System */
class Physics_Sys {
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
    constructer(){
	// Public 
	this.particles = [];
	this.forces;
	this.constraints; 

	// Private
	this._physics = new Physics_Sys; 
    }
}

class Particle {
    constructor(){
	// Public
	this.position = vec3.create();
	this.velocity = vec3.create();
	this.acceleration = vec3.create();

	// Private
	this._damping = 0.998; // Remove energy added by degeneracy
	this._mass_inverse;
    }
    
    /** Shorthand Accesors */
    get p (){
	return this.position; 
    }
    get v (){
	return this.velocity; 
    }
    get a (){
	return this.acceleration;
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

