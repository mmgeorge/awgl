
'use strict';

/** A container for holding a  representation of two objects 
    in contact */
class Contact {
    Constructor(){
	this.particles = Array(2);
	this.restitution;              // Normal restitution coefficient
	this.normal = vec3.create();   // Direction of the contact
	this.penetration;              // Penetration depth at contact
    }

    /** Resolve contact velocity & interpenetration */
    _resolve(duration){
	_resolve_velocity(duration);
	if(penetration > 0) _resolve_interpenetration(duration);
    }

    /** Calculates the separating veloicty at the contact */
    _separating_velocity(){
	if (particle[1]) return vec3.dot(vec3.sub(particle[0].v, particle[1].v), this.normal);
	else return vec3.dot(particle[0].v, this.normal); 
    }

    /** Calculates the total imass for the contact */
    _imass_total(){
	let imass_tot = this.particle[0].imass;
	if (this.particle[1]) imass_tot += this.particle[1].imass;
	return imass_tot; 
    }
    
    /** Resolves impulse calcualations */
    _resolve_velocity(duration){
	let particle = this.particle;
	
	let sep_v = _separating_velocity(); 
	if(sep_v > 0) return;          // No impulse is required.
	let sep_v1 = -sep_v * this.restitution;
	let dV = sep_v1 - sep_v;

	let imass_tot = _imass_total();
	if (imass_tot <= 0) return;    // All particles have infinite mass

	//impulse per unit of imass
	let impulse_p_imass = vec3.scale(this.normal,
					    (dV / imass_tot)); //impulse
 
	particle[0].v = vec3.add(particle[0].v,
				 vec3.scale(impulse_p_imass,
					    particle[0].imass));
	if (particle[1]){
	    particle[1].v = vec3.add(particle[0].v,
				 vec3.scale(impulse_p_imass,
					    -particle[0].imass)); //opposite direction
	}
	
    }

    /** Resolves contact interpenetration */
    _resolve_interpenetration(duration){
	let imass_tot = _imass_total();
	if (imass_tot <= 0) return; // All particles have infinite mass

	let move_p_imass = vec3.scale(this.normal,(this.penetration/imass_tot));

	particle[0].p = vec3.add(particle[0].p, vec3.scale(move_p_imass,particle[0].imass));
	if(particle[1])
	    particle[1].p = vec3.add(particle[1].p, vec3.scale(move_p_imass,-particle[1].imass));
    }

}

/** pp 134 */
