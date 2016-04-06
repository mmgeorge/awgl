'use strict';


// Store for commonly used definitions 
class Physics {
    constructor(args){
	let gravity = args.gravity || -10; 
	this.gravity = new vec3(0,gravity,0); 
    }

    get g (){
	return this.gravity; 
    }
}


class Particle {
    constructor(){
	this.position = vec3(0,0,0);
	this.velocity = vec3.create();
	this.acceleration = vec3.create();

	this._damping = 0.998; // Remove energy added by degeneracy
	this._mass_inverse;
	this._physics = new Physics; 
	
    }

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

function map (func, arr){
    return arr.map(func); 
}
