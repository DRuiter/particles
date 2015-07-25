function ParticleEmitter(canvas, options){
	if(!options) options = {};
	if(!options.particle) options.particle = {};
	if(!options.connect) options.connect = {};

	this.particles 					= [];
	this.canvas 						= canvas;

	this.total 							= options.total || 200;

	this.particle 					= {};
	this.particle.lifetime	= options.particle.lifetime || Infinity;
	this.particle.color 		= options.particle.color || 'rgba(255, 255, 255, 1)';
	this.particle.size 			= options.particle.size || 0.25;
	this.particle.speedScale= options.particle.speedScale || 0.25;

	this.connect 						= {};
	this.connect.enabled 	  = typeof options.connect.enabled === 'boolean' ? options.connect.enabled : true;
	this.connect.distance		= options.connect.distance || 50;
	this.connect.color 			= options.connect.color || 'rgba(255, 255, 255, {$opacity})';
	this.connect.size 			= options.connect.size || 0.5;

	for(var i = 0; i < this.total; i++){
		var x = Math.round(Math.random() * canvas.el.width),
				y = Math.round(Math.random() * canvas.el.height);

		this.particles.push(new Particle(x, y));
	}
}

ParticleEmitter.prototype.draw = function (timestamp){
	var slicedParticles, particleCheck, particle, distance, opacity, style, x, y, i, k;

	this.canvas.clear();

	for(i = 0, l = this.particles.length; i < l; i++){
		particle 	= this.particles[i];

		if(i !== 0) particle.translate(particle.vector, {apply: true, scale: this.particle.speedScale});

		//Reverse particles if they exit the bounds
		if(	particle.x < (0 - this.connect.distance)	||
				particle.x > (this.canvas.el.width + this.connect.distance) ||
				particle.y < (0 - this.connect.distance) ||
				particle.y > (this.canvas.el.height + this.connect.distance)){

			x = Math.round(Math.random() * this.canvas.el.width);
			y = Math.round(Math.random() * this.canvas.el.height);

			particle.vector.reverse({apply:true});
		}

	}

	for(i = 0, l = this.particles.length; i < l; i++){
		particleCheck 	= this.particles[i];

		if(this.connect.enabled && this.connect.distance > 0){
			slicedParticles = this.particles.slice(i, this.particles.length);

			for(k = 0, p = slicedParticles.length; k < p; k++){
				particle 	= slicedParticles[k];
				distance 	= particleCheck.distanceTo(particle);

				if(distance < this.connect.distance) {
					opacity = (this.connect.distance - distance) / this.connect.distance;
					style 	= 'rgba(255, 255, 255, '+ opacity.toFixed(2) +')';

					particle.lineTo(this.canvas.ctx, particleCheck, {lineWidth: this.connect.size, strokeStyle: style});
				}
			}
		}

		particleCheck.draw(this.canvas.ctx, {radius: this.particle.size, fillStyle: this.particle.color});
	}

	requestAnimationFrame(this.draw.bind(this));
};
