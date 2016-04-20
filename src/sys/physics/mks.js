/** Declare a default measurement system */

/** MKS Unit Conversions */
class MKS {
    constructor(opts){
	let args = opts || {}; 
	let m_d = args.m_d || 1;
	let kg_d = args.kg_d || 1000;
	let s_d = args.s_d || 1000;
	
	// Divisiors
	this.m_d = m_d;
	this.kg_d = kg_d;
	this.s_d = s_d;	
    }

    /** Conversions */
    m(x){
	return x / m_d; 
    }
    kg(x){
	return x / k_d; 
    }
    s(x){
	return x / s_d; 
    }
}


var mks = new MKS({}); 
