
'use strict';

/** Defintiions for a 3x3 matrix */
class mat3b {
    constructor(a,b,c,
		d,e,f,
		g,h,i){
	if (arguments.length != 9) throw new Error("Not enough args for mat3!"); 
	this.data = new Float32Array(arguments);
    }

    static identity(){
	return new mat3b(
	    1,0,0,
	    0,1,0,
	    0,0,1); 
    }

    static multiply_mats(mat1, mat2){
	let a = mat1.data;
	let b = mat2.data;
	return new mat3b(
	    a[0]*b[0] + a[1]*b[3] + a[2]*b[6],
	    a[0]*b[1] + a[1]*b[4] + a[2]*b[7],
	    a[0]*b[2] + a[1]*b[5] + a[2]*b[8],
	    a[3]*b[0] + a[4]*b[3] + a[5]*b[6],
	    a[3]*b[1] + a[4]*b[4] + a[5]*b[7],
	    a[3]*b[2] + a[4]*b[5] + a[5]*b[8],
	    a[6]*b[0] + a[7]*b[3] + a[8]*b[6],
	    a[6]*b[1] + a[7]*b[4] + a[8]*b[7],
	    a[6]*b[2] + a[7]*b[5] + a[8]*b[8]); 
    }

    multiply(mat){
	let a = this.data;
	let b = mat.data;
	{ // First row
	    let a0 = a[0]*b[0] + a[1]*b[3] + a[2]*b[6];
	    let a1 = a[0]*b[1] + a[1]*b[4] + a[2]*b[7]; 
	    let a2 = a[0]*b[2] + a[1]*b[5] + a[2]*b[8];
	    a[0] = a0; a[1] = a1; a[2] = a2; 
	}
	{ // Second row
	    let a3 = a[3]*b[0] + a[4]*b[3] + a[5]*b[6];
	    let a4 = a[3]*b[1] + a[4]*b[4] + a[5]*b[7];
	    let a5 = a[3]*b[2] + a[4]*b[5] + a[5]*b[8];
	    a[3] = a3; a[4] = a4; a[5] = a[5]; 
	}
	{ // Third row
	    let a6 = a[6]*b[0] + a[7]*b[3] + a[8]*b[6];
	    let a7 = a[6]*b[1] + a[7]*b[4] + a[8]*b[7];
	    let a8 =  a[6]*b[2] + a[7]*b[5] + a[8]*b[8];
	    a[6] = a6; a[7] = a7; a[8] = a[8]; 
	}	
    }
}

/** Defintions for a 4x4 matrix */
class mat4b {
    constructor(a,b,c,d,
		e,f,g,h,
		i,j,k,l,
		m,n,o,p){
	if (arguments.length != 16) throw new Error("Not enough args for mat4!"); 
	this.data = new Float32Array(arguments);
    }

    static identity(){
	return new mat4b(
	    1,0,0,0,
	    0,1,0,0,
	    0,0,1,0,
	    0,0,0,1); 
    }
    
    static multiply_mats(mat1, mat2){
	let a = mat1.data;
	let b = mat2.data;
	return new mat4b(
	    a[0]*b[0] + a[1]*b[4] + a[2]*b[8] + a[3]*b[12],
	    a[0]*b[1] + a[1]*b[5] + a[2]*b[9] + a[3]*b[13],
	    a[0]*b[2] + a[1]*b[6] + a[2]*b[10] + a[3]*b[14],
	    a[0]*b[3] + a[1]*b[7] + a[2]*b[11] + a[3]*b[15],
	    a[4]*b[0] + a[5]*b[4] + a[6]*b[8] + a[7]*b[12],
	    a[4]*b[1] + a[5]*b[5] + a[6]*b[9] + a[7]*b[13],
	    a[4]*b[2] + a[5]*b[6] + a[6]*b[10] + a[7]*b[14],
	    a[4]*b[3] + a[5]*b[7] + a[6]*b[11] + a[7]*b[15],
	    a[8]*b[0] + a[9]*b[4] + a[10]*b[8] + a[11]*b[12],
	    a[8]*b[1] + a[9]*b[5] + a[10]*b[9] + a[11]*b[13],
	    a[8]*b[2] + a[9]*b[6] + a[10]*b[10] + a[11]*b[14],
	    a[8]*b[3] + a[9]*b[7] + a[10]*b[11] + a[11]*b[15],
	    a[12]*b[0] + a[13]*b[4] + a[14]*b[8] + a[15]*b[12],
	    a[12]*b[1] + a[13]*b[5] + a[14]*b[9] + a[15]*b[13],
	    a[12]*b[2] + a[13]*b[6] + a[14]*b[10] + a[15]*b[14],
	    a[12]*b[3] + a[13]*b[7] + a[14]*b[11] + a[15]*b[15]); 
    }

     multiply(mat){
	let a = this.data;
	let b = mat.data;

	 { // Row1
	     let a0 = a[0]*b[0] + a[1]*b[4] + a[2]*b[8] + a[3]*b[12];
	     let a1 = a[0]*b[1] + a[1]*b[5] + a[2]*b[9] + a[3]*b[13];
	     let a2 = a[0]*b[2] + a[1]*b[6] + a[2]*b[10] + a[3]*b[14];
	     let a3 = a[0]*b[3] + a[1]*b[7] + a[2]*b[11] + a[3]*b[15];
	     a[0] = a0; a[1] = a1; a[2] = a2; a[3] = a3;
	 }
	 { // Row2
	     let a4 = a[4]*b[0] + a[5]*b[4] + a[6]*b[8] + a[7]*b[12];
	     let a5 = a[4]*b[1] + a[5]*b[5] + a[6]*b[9] + a[7]*b[13];
	     let a6 = a[4]*b[2] + a[5]*b[6] + a[6]*b[10] + a[7]*b[14];
	     let a7 = a[4]*b[3] + a[5]*b[7] + a[6]*b[11] + a[7]*b[15];
	     a[4] = a4; a[5] = a5; a[6] = a6; a[7] = a7;
	 }
	 { // Row3
	     let a8 = a[8]*b[0] + a[9]*b[4] + a[10]*b[8] + a[11]*b[12];
	     let a9 = a[8]*b[1] + a[9]*b[5] + a[10]*b[9] + a[11]*b[13];
	     let a10 = a[8]*b[2] + a[9]*b[6] + a[10]*b[10] + a[11]*b[14];
	     let a11 = a[8]*b[3] + a[9]*b[7] + a[10]*b[11] + a[11]*b[15];
	     a[8] = a8; a[9] = a9; a[10] = a10; a[11] = a11;
	 }
	 { // Row4
	     let a12 = a[12]*b[0] + a[13]*b[4] + a[14]*b[8] + a[15]*b[12];
	     let a13 = a[12]*b[1] + a[13]*b[5] + a[14]*b[9] + a[15]*b[13];
	     let a14 = a[12]*b[2] + a[13]*b[6] + a[14]*b[10] + a[15]*b[14];
	     let a15 = a[12]*b[3] + a[13]*b[7] + a[14]*b[11] + a[15]*b[15];
	     a[12] = a12; a[13] = a13; a[14] = a14; a[15] = a15;
	 }
     }
}
