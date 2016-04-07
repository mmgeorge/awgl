'use strict';

/** Utility functions for AWGL. 
    Time-stamp: <2016-04-07 15:38:59> */

/** Constants */
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

/** Reserved Namespaces */
var _SHDR = {
    MODEL : 0,
    PARTICLE : 1,
};

/** Add a global symbol */
function add_global_sym(sym, index){
    let to_eval = 'window.'.concat(sym).concat('=').concat(index);
    eval(to_eval); 
}

/** SHADER CREATION /
    INITIALIZATION
------------------------------------- */

/** Set shader program */
function set_shader(gl, shader){
    gl.useProgram(shader);
    gl.program = shader;
}

/** Create a shader program */
function mk_shader(gl, vshdr, fshdr){
    let vshader = compile_shader(gl, gl.VERTEX_SHADER, vshdr);
    let fshader = compile_shader(gl, gl.FRAGMENT_SHADER, fshdr);
    if (!vshader || !fshader) throw new Error ("Error compiling shaders!");

    let shdr_program = gl.createProgram();
    if (!shdr_program) throw new Error ("Could not create shader program!");

    gl.attachShader(shdr_program, vshader);
    gl.attachShader(shdr_program, fshader);
    gl.linkProgram(shdr_program);

    let linked = gl.getProgramParameter(shdr_program, gl.LINK_STATUS);
    if (!linked) throw new Error ("Could not link program!");

    return shdr_program; 
}

/** Compile a shader */
function compile_shader(gl, type, src){
    let shdr = gl.createShader(type);
    if (!shdr) throw new Error("Could not create shader!");

    gl.shaderSource(shdr, src);
    gl.compileShader(shdr);

    let compiled = gl.getShaderParameter(shdr, gl.COMPILE_STATUS);
    if (!compiled){
	let error = gl.getShaderInfoLog(shdr); 
	throw new Error ("Unable to compile shader: \n" + error);
    }

    return shdr; 
}

/** Initialize a WebGL Context. 
    Option arg debug for WebGL debugging */
function init_context(canvas, debug){
    let gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) throw new Error("Could not setup gl context!");
    if (debug) gl = WebGLDebugUtils.makeDebugContext(gl); 
}

/** BUFFER CREATION/
    INITIALIZATION 
------------------------------------- */

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


