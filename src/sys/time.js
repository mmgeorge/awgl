'use strict';

/** Container for calculating elapsed time */
class Time {
    constructor(){
	this._last = Date.now();
	this._now;
    }

    update(){
	this._last = Date.now(); 
    }
    
    get dT(){
	let dT;
	this._now = Date.now();
	dT = this._now - this._last;
	return dT;
    }
    
}

class FPS_Counter {
    constructor(hook){
	this._mtot = 0; // ms accumulator
	this._ftot = 0; // frame accumulator
	this._hook = hook; 
    }

    accum(dT){
	this._mtot += dT;
	this._ftot += 1; 
	if (this._mtot > 1000){
	    this._hook.innerHTML=this._ftot;
	    this._mtot -= 1000;
	    this._ftot = 0;
	}
	
    }
}
