# awgl.js
### Another WebGL utility library
AWGL seeks to take care of some of the more common and tedious housekeeping-related tasks common to WebGL, with a particular emphasis on readibility, brevity, and ease of use. Note that the library is still in the very early stages of development, and definitely not ready for real-world use.   

### Usage
In order to minimize necessary function calls, all arguments are passed using an object-literal syntax that allows for a variable number of arguments. Scene elements are declared and referenced by through the usage of symbols. For instance, when declaring meshes:
```sh
    scene.defmesh({
        fixed: {
            MESH_CUBE: Cube(),
            MESH_SPHERE: Sphere(),
        },
	    mutable:{
	        VMESH_PLANE : Plane(60,60, 10, 10, 100),
	    },
    });   
```
The code creates three new global symbols--MESH_CUBE, MESH_SPHERE, and VMESH_PLANE--that can then be referenced in later function calls:

```sh
 scene.init({
    // Initialize scene lighting
	lights:{
	    blinn_phong:{
	    	L_OVERHEAD:{
		       pos:  [0.0, -0.0, 40.0],
		       ambi: [0.2, 0.2, 0.2],
		       spec: [1.0, 1.0, 1.0],
		       diff: [1.0, 1.0, 1.0],
		    },
	    }},
	// Initialize scene models
	models: {
	    // Create a new global symbol DYNAMIC_PLANE that will use
	    // the mesh we defined earlier
	    DYNAMIC_PLANE :{
		    mesh : VMESH_PLANE,
		    mat : MAT_PEWTER,
		    draw : TRIANGLE_STRIP
	    },
	},
});
```
### Examples

* [planeview] - Demonstrates AWGL usage with a dynamically generated and adjustable mesh. 

### License
MIT 

   [planeview]: <http://mmgeorge.github.io/planeview/>
  
