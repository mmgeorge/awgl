'use strict';
class Model {
    constructor(args){
	let mesh_index = args.mesh || 0;
	let mat_index = args.mat || 0;
	let drawing_mode = args.draw || 0;
	if (Object.keys(args).length != 3)
	    throw new Error('Not enough args! Tried to create a malformed model. ');

	//public
	this.mat_index = mat_index;
	this.mesh_index = mesh_index;

	//private
	this._drawing_mode = drawing_mode;
    }

    draw(gl, uL_mat,  range){
	let start = range[0], end =range[1];
	gl.uniform1i(uL_mat, this.mat_index); //update mat storage uniform
	gl.drawElements(gl.TRIANGLE_STRIP,
			(end-start),
			gl.UNSIGNED_INT,
			(ISIZE*start));	
    }
}
    
