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

	this.raster 						= {}; //[[particles], [particles]]

	for(var i = 0; i < this.total; i++){
		var x = Math.round(Math.random() * canvas.el.width),
				y = Math.round(Math.random() * canvas.el.height);

		this.particles.push(new Particle(x, y));
	}
}

ParticleEmitter.prototype.draw = function (timestamp){
	var slicedParticles, particleCheck, particle, distance, opacity, style, x, y, i, k;

	this.canvas.clear();

	if(this.connect.enabled && this.connect.distance){
		for(i = 0, l = this.particles.length; i < l; i++){
			particle 	= this.particles[i];

			if(i !== 0) particle.translate(particle.vector, {apply: true, scale: this.particle.speedScale});

			//Reverse particles if they exit the bounds
			if(	particle.x < 0 ||
					particle.x > this.canvas.el.width ||
					particle.y < 0 ||
					particle.y > this.canvas.el.height){

				if(particle.x < 0) particle.x = 0;
				if(particle.y < 0) particle.y = 0;

				particle.vector.reverse({apply:true});
			}

		}

		this.drawRasterized();

		return requestAnimationFrame(this.draw.bind(this));
	}

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


	return requestAnimationFrame(this.draw.bind(this));
};

ParticleEmitter.prototype.drawRasterized = function(){
	var sorted = this.binSort(),
			i,
			l,
			k,
			j,
			bin,
			checkBins,
			checkBinsIndexes,
			particle;

	for(i = 0, l = sorted.bins.length; i < l; i++){
		bin 			= sorted.bins[i];
		checkBins = this.getAdjacentBins(i, sorted);

		checkBins.push(bin);

		this.drawBin(bin, checkBins);
	}

	for(i = 0, l = this.particles.length; i < l; i++){
		this.particles[i].draw(this.canvas.ctx, {radius: this.particle.size, fillStyle: this.particle.color});
	}
};

ParticleEmitter.prototype.drawBin = function(bin, checkBins){
	var pi,
			pl,
			bi,
			bl = checkBins.length,
			cpi,
			cpl,
			particle,
			checkBin,
			checkParticle,
			distance,
			slicedParticles;

	for(pi = 0, pl = bin.length; pi < pl; pi++){
		particle = bin[pi];

		for(bi = 0; bi < bl; bi++){
			checkBin = checkBins[bi];

			for(cpi = 0, cpl = checkBin.length; cpi < cpl; cpi++){
				checkParticle = checkBin[cpi];

				distance 	= checkParticle.distanceTo(particle);

				if(distance < this.connect.distance) {
					opacity = (this.connect.distance - distance) / this.connect.distance;
					style 	= 'rgba(255, 255, 255, '+ opacity.toFixed(2) +')';

					particle.lineTo(this.canvas.ctx, checkParticle, {lineWidth: this.connect.size, strokeStyle: style});
				}
			}
		}
	}
};

ParticleEmitter.prototype.getAdjacentBins = function(num, sortedBins){
	var adjacent = [],
			width 	 = sortedBins.width,
			height 	 = sortedBins.height,
			bins 		 = sortedBins.bins,
			indexes  = [
				num - width, //top
				(num - width) + 1, //top right
				num + 1, //right
				(num + width) +1, //bottom right
				num + width, //bottom
				(num + width) - 1, //bottom left
				num - 1, //left
				(num - width) - 1 //top left
			],
			binLength = bins.length;

	for(var i = 0, l = indexes.length; i < l; i++){
		if(indexes[i] > 0 && indexes[i] < binLength){
			adjacent.push(bins[indexes[i]]);
		}
	}

	return adjacent;
};

ParticleEmitter.prototype.binSort = function(){
	/*
		ex width = 1000, height = 1000, distance = 50;

		rw = 20, rh = 20, binCount = 400

		particle = {x: 700, y: 300};
		bin = 14 + (6 * 20) = 134
	*/
	//Calculate min size of raster
	var distance 	= this.connect.distance > 10 ? this.connect.distance : 10,
			rw 				= Math.ceil(this.canvas.el.width / distance),
			rh 				= Math.ceil(this.canvas.el.height / distance),
			bins 			= [],
			binCount  = rw * rh,
			particle,
			x,
			y,
			bin,
			i;

	//Prepare bins
	for(i = 0; i < binCount; i++){
		bins.push([]);
	}

	//Iterate particles
	for(i = 0, l = this.particles.length; i < l; i++){
		particle 	= this.particles[i];
		x 				= particle.x;
		y 				= particle.y;
		bin 			= Math.floor(x / distance) + (Math.floor(y / distance) * rw);

		bins[bin].push(particle);
	}

	return {
		width: rw,
		height: rw,
		bins: bins
	};
};
