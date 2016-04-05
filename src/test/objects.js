"use strict";

var floatsPerVertex = 6;
function Plane(c_x, c_y, displacement, side_height) {
    let len = 0.5;
    let positions = [];
    let indicies = [];

    let num_verticies = c_x*c_y;
    let step = 6.283185307*(1/num_verticies);
    let curr_step = 0;

    let xstep = step*10;
    let cxstep = 6.283185307*1/c_x; 

    for (let x=0; x < c_x; x++){
	cxstep = 0;
	
	for (let y=0; y<c_y; y++){
	    curr_step += step;
	    cxstep += xstep;

	    let displace = Math.random()*displacement;
	    let height = Math.cos(curr_step)*side_height
	    let xvarying = Math.sin(cxstep*side_height);

	    positions.push(x);  // x
	    positions.push(y);  // y
	    positions.push((displace+height)*xvarying);    // z
	}
    }
    
    for (var strips=0; strips < c_x-1; strips++){
	var temp_indicies = [];
	if  (!(strips & 1)){
	    for (let y=0; y < c_y; y++){
		let i = y+  c_y*strips;
		indicies.push(i);        // Push first column
		indicies.push(i+c_y);    // Push second column
	    }
	} else{
	    for (let y=(c_y*(strips+1))-1; y >= c_y*strips; y--){
		indicies.push(y);        // Push first column
		indicies.push(y+c_y);    // Push second column
	    }

	}
    }
    return [positions, indicies, 0];
}
