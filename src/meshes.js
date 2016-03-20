'use strict';

class Mesh {
    constructor(gl, mutable, meshes){
	
	//public
	this._locations=[];
	
	//private
	this.mutable = mutable;
	this._meshes = this._concat_meshes(meshes);
	/*
	if (mutable){
	    this._meshes= meshes; 
	}
	else {
	    this._meshes = this._concat_meshes(meshes); 
	}
	*/   
    } 

    get indicies(){
	return this._meshes[1];
    }

    get positions(){
	return this._meshes[0];
    }
    
    _concat_meshes(meshes){
	let positions =[], indicies = [], normals =[];
	let last_len = 0, last_vertex_len = 0;

	this._locations.push(0);
	for (let x = 0; x<meshes.length;x++){
	    // Update index array to be sequential
	    let curr_indicies = meshes[x][1];
	    let new_arr = [];
	    
	    for (let i =0; i<curr_indicies.length; i++){
		new_arr.push(curr_indicies[i] + last_vertex_len/FLOATSPERVERTEX);
	    }
	    
	    last_len += curr_indicies.length;
	    last_vertex_len += meshes[x][0].length; 

	    // Concat Verticies/Indicies
	    positions = positions.concat(meshes[x][0]);
	    indicies = indicies.concat(new_arr);
	    
	    this._locations.push(last_len);
	}
	return [positions, indicies, normals];
    }

    init_array_buffers(gl){
	let positions = new Float32Array(this._meshes[0]);
	FSIZE = positions.BYTES_PER_ELEMENT;
	if (this.mutable){
	    gl.bindBuffer(gl.ARRAY_BUFFER, null);
	    if (!initArrayBuffer(gl, gl.DYNAMIC_DRAW, 'POSITION_MUT',
				 positions, 3, gl.FLOAT, FSIZE*3, 0)){
		throw new Error('Failed to create dynamic array buffers!');
	    }
	}
	else {
	    if (!initArrayBuffer(gl, gl.STATIC_DRAW, 'POSITION_STAT',
				 positions, 3, gl.FLOAT, FSIZE*3, 0)){
		throw new Error('Failed to create static array buffers!');
	    }
	}
    }

    init_index_buffer(gl, indicies_static, indicies_mut){
	let indicies = new Float32Array(indicies_static.concat(indicies_mut));
	ISIZE = indicies.BYTES_PER_ELEMENT;
	
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	var indexBuffer = gl.createBuffer();
	if (!indexBuffer) {
	    throw new Error('Failed to create the buffer object');
	    return -1;
	}
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indicies, gl.STATIC_DRAW);
    }

	
	
/*
    init_buffers(gl){
	let meshes = this._meshes; 
	var positions = new Float32Array(meshes[0]);
	var indicies =  new Uint16Array(meshes[1]);
//	var normals =  new Float32Array(a_concatObjects[2]);
	FSIZE = positions.BYTES_PER_ELEMENT;
	ISIZE = indicies.BYTES_PER_ELEMENT;

	if (this.mutable){
	    if (!initArrayBuffer(gl, gl.DYNAMIC_DRAW, 'POSITION_MUT',
				 positions, 3, gl.FLOAT, FSIZE*3, 0)){
		throw new Error('Failed to create dynamic array buffers!');
	    }
	}
	else {
	    if (!initArrayBuffer(gl, gl.STATIC_DRAW, 'POSITION_STAT',
				 positions, 3, gl.FLOAT, FSIZE*3, 0)){
		throw new Error('Failed to create static array buffers!');
	    }
	    gl.bindBuffer(gl.ARRAY_BUFFER, null);
	    var indexBuffer = gl.createBuffer();
	    if (!indexBuffer) {
		throw new Error('Failed to create the buffer object');
		return -1;
	    }
	    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
	    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indicies, gl.STATIC_DRAW);
	}
	
//	if (readNormals){
//	    if (!initArrayBuffer(gl, 'a_Normal', normals, 3, gl.FLOAT, FSIZE*3, 0))
//		return -1;
//	}
//	if (!this.mutable){
//	    delete this._meshes; // Free space for fixed meshes since we wont need it again
//	}
	
	return indicies.length;
    }
*/
    get_start_end (index){
	let start, end; 
	start = this._locations[index];
	end = this._locations[(index)+1];
	return [start, end];

    }

    mutate(gl, mesh){
	if (this.mutable){
	    _init_buffers(gl, _concat_meshes(meshes));
	}
	else {
	    throw new Error('Attempted to mutate a fixed mesh!')
	}
    }
}

