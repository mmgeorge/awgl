// -------------------------------------
// AGL - Another WebGL library 
// Matt George 
// -------------------------------------
// TODO:
// uL_light_sys

'use strict';

class Scene {
    constructor (canvas){
	//public
	this.canvas = canvas; 
	this.time = new Time();
	this.mat4_model = new Matrix4();
	this.mat4_mvp = new Matrix4();
	this.mat4_normal = new Matrix4();

	//private
	this._gl;
	this._lights = [];
	this._models = [];
	this._materials = []; 
	this._meshes_fixed; 
	this._meshes_mutable; 
	this._camera;
	this._buffers = Array(null,null,null); 

	this._symtbl_lights = [];
	this._symtbl_mats = []; 
	this._symtbl_meshes = [];
	this._symtbl_models = []; 
	this._begin_mut_mesh = 0;
	this.__draw_stack__;
	this.__last_draw_stack__;
	this._UI_ELEMENTS_ = Array(20);
	
	//GLSL hooks
	this._uL_mat4_model;
	this._uL_mat4_mvp;
	this._uL_mat4_normal;
	this._uL_light_sys;
	this._uL_mat;
	this._uL_mutable; 
    }

    get _static_buffer(){
	if (this._buffers[0]){
	    return this._buffers[0]
	}
	else {
	    throw new Error('The static buffer is not initialized!')
	}
    }

    get _dynamic_buffer(){
	if (this._buffers[1]){
	    return this._buffers[1]
	}
	else {
	    throw new Error('The dynamic buffer is not initialized!')
	}
    }

    get _index_buffer (){
	if (this._buffers[2]){
	    return this._buffers[2]
	}
	else {
	    throw new Error('The index buffer is not initialized!')
	}
    }
    
    _init_(n_lights, n_mats){
	this._gl = this.canvas.getContext("webgl",{stencil:true} );
	if (!this._gl) {
	    throw new Error('Failed to get the rendering context.')
	}

	this._gl.getExtension("OES_standard_derivatives");
	this._gl.getExtension("OES_element_index_uint");


	this._init_shaders_(n_lights, n_mats);
	this._init_mats_();
	this._init_locations_();
	this._init_array_buffers_(this._gl); 
	this._init_index_buffer_(this._gl);
	this._init_scene_();
    }

    _init_shaders_(n_lights, n_mats){
	FSHADER_SOURCE =
	    "#define READ_SRC 1 \n" +
	    "#define NUM_LIGHTS " + n_lights + " \n" +
	    "#define NUM_MATERIALS " + n_mats + " \n" + FSHADER_SOURCE;
	if (!initShaders(this._gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
	    throw new Error('Failed to intialize shaders.');
	}
    }
    
    _init_locations_(){
	this._uL_mat4_model = this._gl.getUniformLocation(this._gl.program, 'u_ModelMatrix');
	this._uL_mat4_mvp = this._gl.getUniformLocation(this._gl.program, 'u_MvpMatrix');
	this._uL_mat = this._gl.getUniformLocation(this._gl.program, 'u_matIndex');
	this._uL_mutable = this._gl.getUniformLocation(this._gl.program, 'mutable');
	if(!this._uL_mat4_model || !this._uL_mat4_mvp || !this._uL_mat){
	        throw new Error("Failed to get scene storage locations");
	   }
    }
    
    _init_scene_(){
	this._gl.clearColor(0.0, 0.0, 0.0, 1.0);
	this._gl.enable(this._gl.DEPTH_TEST);
    }

    _init_light(light_sys, light){
	this._lights.push(new Light(this._gl, this._lights.length, light_sys, light));
    }

    _init_camera(position, lookAt, up){
	this.camera = new Camera(this._gl, position, lookAt, up);
	
    }

    _init_mats_(){
	let tmp_mats = this._materials;
	this._materials = []; 
	for (let x=0; x< tmp_mats.length; x++){
	    let mat = tmp_mats[x];
	    this._materials.push(new Material(this._gl,
					      this._materials.length,
					      mat[0],mat[1],mat[2], mat[3], mat[4])); 
	}
	
    }

    _set_light(index, values){
	this._lights[index].set(values);
    }

    _init_array_buffers_(gl){
	let positions;
	
	// Static buffer
	if (this._meshes_fixed){
	    positions = new Float32Array(this._meshes_fixed.positions);
	    FSIZE = positions.BYTES_PER_ELEMENT;
	    gl.bindBuffer(gl.ARRAY_BUFFER, null);
	    this._buffers[0] = init_buffer(gl, positions, gl.STATIC_DRAW);
  
	}
	// Dynamic buffer
	if(this._meshes_mutable){
	    positions = new Float32Array(this._meshes_mutable.positions);
	    FSIZE = positions.BYTES_PER_ELEMENT;
	    gl.bindBuffer(gl.ARRAY_BUFFER, null);
	    this._buffers[1] = init_buffer(gl, positions, gl.DYNAMIC_DRAW);
	}

    }
    
    _init_index_buffer_(gl, indicies_static, indicies_mut){
	let ind = []; 
	if (this._meshes_fixed){
	    ind =ind.concat(this._meshes_fixed.indicies);
	}
	if (this._meshes_mutable){
	    ind = ind.concat(this._meshes_mutable.indicies);

	}
	let indicies = new Uint32Array(ind);
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

    init(args){
	let lights  = args.lights  || false;
	let models = args.models || false;
	let camera  = args.camera  || false;

	let self = this; 

	for (let light_sys in lights){
	    let lights_tmp = []; // Store light models so we can delay execution
	    for (let light in lights[light_sys]){
		add_global_sym(light, self._symtbl_lights.length);
		self._symtbl_lights.push(light)
		lights_tmp.push(lights[light_sys][light]);
	    }
	    self._init_(lights_tmp.length, self._materials.length);
	    lights_tmp.map(function(x){self._init_light(light_sys, x)});

	}
	
	for (let model in models){
	    add_global_sym(model, self._symtbl_models.length);
	    self._symtbl_models.push(model);
	    self._models.push(new Model(models[model]));
	}
	
	self.__draw_stack__ = Array(self._models.length)
	
	self._camera = new Camera(self._gl, camera); 
	
    }

    defmat(args){
	if (this._symtbl_mats.length){
	    throw new Error('Materials have already been initialized!')
	}
	let mats_tmp = []; 
	for (let material in args){
	    add_global_sym(material, this._symtbl_mats.length);
	    this._symtbl_mats.push(material);
	    let mat = args[material];
	    this._materials.push(mat);

	}
    }

    defmesh(args){
	let fixed = args.fixed || false;
	let mutable = args.mutable || false;

	let self = this; 
	
	if (self._symtbl_meshes.length){
	    throw new Error('Meshes have already been initialized!')
	}

	if(fixed){
	    let tmp_meshes_fixed= []; 
	    for (let mesh in fixed){
		if(self._symtbl_meshes.indexOf(mesh) != -1){
		    throw new Error(mesh.concat(' has already been defined!'));
		}
		add_global_sym(mesh, self._symtbl_meshes.length);
		self._symtbl_meshes.push(mesh);
		tmp_meshes_fixed.push(fixed[mesh]); 
	    }
	    self._meshes_fixed = new Mesh(this._gl, false, tmp_meshes_fixed);
	    self._begin_mut_mesh = self._symtbl_meshes.length; 
	} else {
            self._meshes_fixed = false; 
        }
	
	if(mutable){
	    let tmp_meshes_mutable= []; 
	    for (let mesh in mutable){
		if(self._symtbl_meshes.indexOf(mesh) != -1){
		    throw new Error(mesh.concat(' has already been defined!'));
		}
		add_global_sym(mesh, self._symtbl_meshes.length);
		self._symtbl_meshes.push(mesh);
		tmp_meshes_mutable.push(mutable[mesh]); 
	    }
	    self._meshes_mutable = new Mesh(this._gl, true, tmp_meshes_mutable); 
	} else {
            self._meshes_mutable = false; 
        }
    }
    
    switchMode(index){
	this._gl.uniform1i(this._uL_light_sys, index);
    }

    set(options){
	var options = options || {};
	var mat4_model = options.model || false;
	var mat4_mvp = options.mvp || false;

	if (ModelMatrix){
	    this.mat4_model = mat4_model;
	    this._gl.uniformMatrix4fv(this._uL_mat4_model, false, this.mat4_model.elements);
	}
	if (MvpMatrix){
	    this.mat4_mvp = mat4_mvp;
	    this._gl.uniformMatrix4fv(this._uL_mat4_mvp, false, this.mat4_mvp.elements);
	}
    }

    update(options){
	var options = options || {};
        let meshes = options.meshes || false;
        let gl = this._gl;
        
        if (meshes){
            gl.bindBuffer(gl.ARRAY_BUFFER, this._dynamic_buffer)
            for (let mesh in meshes){
                //we only want the verticies
                gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(meshes[mesh][0]))
            }
        }
    }

    draw (symbol, mat4_model){
	this.__draw_stack__[symbol] = mat4_model; 

    }

    drawUI (symbol, mat4_model){
	this._UI_ELEMENTS_[symbol] = mat4_model; 

    }

    render(){
	let gl = this._gl;
	let mat4_mvp = new Matrix4();
	mat4_mvp.set(this._camera.mat4_VP(this._gl, PERSPECTIVE, this.time.dT));
	this._gl.viewport(0,0, this._gl.drawingBufferWidth, this._gl.drawingBufferHeight);

        if(this._meshes_mutable){
            //Bind dynamic buffer
	    gl.bindBuffer(gl.ARRAY_BUFFER, this._buffers[1]);
	    bind_attrib(gl, 'a_Position', 3, gl.FLOAT, FSIZE*3, 0);

	    //Execute dynamic draws
	    for (let i=0; i<this._models.length; i++){
	        let mat4_model = this.__draw_stack__[i];
	        if (mat4_model){
		    
		    //Update matricies
		    let t_mat4_mvp = new Matrix4(mat4_mvp);
		    t_mat4_mvp.multiply(mat4_model);
		    gl.uniformMatrix4fv(this._uL_mat4_model, false, mat4_model.elements);
		    gl.uniformMatrix4fv(this._uL_mat4_mvp, false, t_mat4_mvp.elements);

		    //Draw
		    let model = this._models[i]; 
		    let mesh_index = model.mesh_index;
		    if (mesh_index >= this._begin_mut_mesh){
		        mesh_index -= this._begin_mut_mesh;
		        let range = this._meshes_mutable.get_start_end(mesh_index);
                        if (this._meshes_fixed){
                    	    range[0] += this._meshes_fixed.indicies.length;
                        }
		        model.draw(this._gl,
			           this._uL_mat,
			           range); 
		    }
	        }   
            }
	}
        if(this._meshes_fixed){
            //Bind static buffer
	    gl.bindBuffer(gl.ARRAY_BUFFER, this._buffers[0]);
	    bind_attrib(gl, 'a_Position', 3, gl.FLOAT, FSIZE*3, 0);
	    
	    //Execute static draws
	    for (let i=0; i<this._models.length; i++){
	        let mat4_model = this.__draw_stack__[i];
	        if (mat4_model){
		    
		    //Update matricies
		    let t_mat4_mvp = new Matrix4(mat4_mvp);
		    t_mat4_mvp.multiply(mat4_model);
		    gl.uniformMatrix4fv(this._uL_mat4_model, false, mat4_model.elements);
		    gl.uniformMatrix4fv(this._uL_mat4_mvp, false, t_mat4_mvp.elements);

		    //Draw
		    let model = this._models[i];
		    let mesh_index = model.mesh_index;
		    if (mesh_index < this._begin_mut_mesh){
		        model.draw(this._gl,
			           this._uL_mat,
			           this._meshes_fixed.get_start_end(mesh_index)); 
		    }
	        }
	    }
        }

	this.__last_draw_stack__ = this.__draw_stack__;
//	this._draw_hud(); 
    }

    _draw_hud(){
	let mat4_mvp = new Matrix4();
	let mat4_view = new Matrix4();

	let zoom = 5;
	let vpAspect = (this._gl.drawingBufferWidth)/(this._gl.drawingBufferHeight); 

	if (vpAspect >= 1){ //When width > height
	    mat4_mvp.setOrtho(-vpAspect*zoom, vpAspect*zoom, // left,right;
  			       -zoom, zoom, 	                          	 // bottom, top;
  			       0, 100);			 	 // near, far; (always >=0)
	} else {
	    mat4_mvp.setOrtho(-zoom, zoom, 	   	 // left,right;
  			       -1/vpAspect*zoom, 1/vpAspect*zoom, 		 // bottom, top;
  			      0, 100);				 // near, far; (always >=0)
	}

	mat4_view.setLookAt( 6,0,0, 0,0,0, 0,0,1);
	mat4_mvp = mat4_mvp.concat(mat4_view);

	
	for (let i=0; i< this._UI_ELEMENTS_.length; i++){
	    let mat4_model = this._UI_ELEMENTS_[i];
	    if (mat4_model){
		let t_mat4_mvp = new Matrix4(mat4_mvp);
		t_mat4_mvp.multiply(mat4_model);
		this._gl.uniformMatrix4fv(this._uL_mat4_model, false, mat4_model.elements);
		this._gl.uniformMatrix4fv(this._uL_mat4_mvp, false, t_mat4_mvp.elements);
		let model = this._models[i];
		let mesh_index = model.mesh_index;
		if (mesh_index < this._begin_mut_mesh){
		    model.draw(this._gl,
			       this._uL_mat,
			       this._meshes_fixed.get_start_end(mesh_index)); 
		}
	    }
	}

    }

    
}
