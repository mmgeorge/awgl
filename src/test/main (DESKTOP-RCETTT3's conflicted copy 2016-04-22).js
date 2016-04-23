"use strict";

var scene;
function main() {
    
    scene = new Scene(document.getElementById('webgl'));
    scene.fps = new FPS_Counter(document.getElementById("fps"));
    
    scene.defmat({
	MAT_PEWTER: MATL_PEWTER,
    });
    
    scene.defmesh({
	fixed:{
	    MESH_PLANE : Plane(60,60, 2, 2, 100),
	},
    });

    
    scene.init({
	lights:{
	    blinn_phong:{
		L_OVERHEAD:{
		    pos:  [0.0, -0.0, 40.0],
		    ambi: [0.2, 0.2, 0.2],
		    spec: [1.0, 1.0, 1.0],
		    diff: [1.0, 1.0, 1.0],
		},
		L_OVERHEAD2:{
		    pos:  [6.0, -9.0, 8.0],
		    ambi: [0.4, 0.4, 0.4],
		    spec: [1.0, 1.0, 1.0],
                    diff: [1.0, 1.0, 1.0],
		},
	    }},
	models: {
	    STATIC_PLANE :{
		mesh : MESH_PLANE,
		mat : MAT_PEWTER,
		draw : TRIANGLE_STRIP
	    },
	},
	camera: {
	    position : [10.0,0.0,0.0],
	    lookAt : [0.0,0.0,0.0],
	    up : [0.0,0.0,1.0],
	    perspective: 40,
	},
    });

    scene.add_particle_sys(1000); 

    winResize();

    document.addEventListener('keydown', function(ev){
	if (!scene._camera.moving){
	    scene._camera.moving = true
	    scene._camera.keyPressed(ev.keyCode); 
	}
    }); 
    
    document.addEventListener('keyup', function(ev){
	if (scene._camera.moving){
	    scene._camera.moving = false;
	    scene._camera.keyUp(); 
	}
    });

    main_loop();
    
    
}


function main_loop(){
    draw(scene);
    requestAnimationFrame(main_loop);
    scene.render();
}

function draw(scene) {
    scene._gl.clear(scene._gl.COLOR_BUFFER_BIT | scene._gl.DEPTH_BUFFER_BIT);

    let m_modelMatrix = new Matrix4(); // Model matrix
    pushMatrix(m_modelMatrix);

    m_modelMatrix.setTranslate(-0,-60,-10);
    m_modelMatrix.scale(2,2,2);    
    m_modelMatrix.rotate(90,0,0,1);
    scene.draw(STATIC_PLANE, m_modelMatrix);

}

function winResize(){
    scene.canvas.width = window.innerWidth;
    scene.canvas.height = window.innerHeight;
    draw(scene); 
    
}
