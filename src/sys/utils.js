'use strict';

var FSIZE, ISIZE;
var FLOATSPERVERTEX = 3;

//Drawing modes
const POINTS = 0x0000;
const LINES = 0x0001;
const LINE_LOOP = 0x0002;
const LINE_STRIP = 0x0003;
const TRIANGLES = 0x0004;
const TRIANGLE_STRIP = 0x0005;
const TRIANGLE_FAN = 0x0006; 

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

function add_global_sym(sym, index){
    let to_eval = 'window.'.concat(sym).concat('=').concat(index);
    eval(to_eval); 
}

function init_buffer (gl, data, type){
    let buf = gl.createBuffer();   // Create a buffer object
    if (!buf) throw new Error('Failed to create the buffer object');
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, data, type);
    return buf; 
}

function bind_attrib (gl, attrib, num, type, stride, offset ){
    let attribute = gl.getAttribLocation(gl.program, attrib);
    if (attribute < 0) throw new Error ('Failed to get the storage location of ' + attrib);
    gl.vertexAttribPointer(attribute, num, type, false, stride, offset);
    gl.enableVertexAttribArray(attribute);

}
