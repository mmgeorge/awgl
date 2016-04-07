'use strict';

/** Container for calculating elapsed time */
class Time {
    constructor(){
	this._last = Date.now();
	this._now;
    }
    get dT(){
	let dT;
	this._now = Date.now();
	dT = this._now - this._last;
	this._last = Date.now();
	return dT;
	
    }
    
}
