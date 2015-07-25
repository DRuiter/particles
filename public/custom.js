window.CONSTANTS = {
	distanceCheck: 50,
	numberOfParticles: 200,
	particleColor: 'rgb(255,255,255)',
	particleSize: 0.25,
	strokeStyle: 'rgba(255, 255, 255, {$opacity})',
	lineWidth: 0.5,
	speedScale: 0.25
};

var CTX 			= new AudioCtx(document.getElementsByTagName('audio')[0], {FFTSize: 128}),
		BUFFER 		= new CustomAudioBuffer(5000, {minDB:CTX.analyser.minDecibels, maxDB:CTX.analyser.maxDecibels}),
		graphEls	= document.getElementsByClassName('graph'),
		graphs 		= [
			new BarGraph(graphEls[0].getContext('2d')),
			new BarGraph(graphEls[1].getContext('2d')),
			new BarGraph(graphEls[2].getContext('2d'))
		];

canvas 	= new Canvas(document.getElementsByTagName('canvas')[0]);

canvas.init();

var particles = [],
		mouseParticle = new Particle(canvas.el.width / 2, canvas.el.height / 2);

for(var i = 0, l = CONSTANTS.numberOfParticles; i < l; i++){
	var x = Math.round(Math.random()*canvas.el.width),
			y = Math.round(Math.random()*canvas.el.height);

	particles.push(new Particle(x, y));
}

//mouseParticle = particles[0];

window.requestAnimationFrame(draw);

var start = 0;

function draw (e){
/*	if((e-start) > 18)
		console.warn(e-start);
	else
		console.log(e-start);
	start = e;*/

	if(CTX.isPlaying()) {
		BUFFER.push(CTX.getFFT('byte'));

		var sample = BUFFER.getLastWithHistory(100),
				values = [
					sample.map(function (item){
						return item.value;
					}),
					sample.map(function (item){
						return item.standardDeviation;
					}),
					sample.map(function (item){
						return item.mean;
					})
				];

		graphs.forEach(function(graph, index){
			if(index === 1){
				graph.draw(values[index], {maxValue: 10, minValue: -10});
			} else {
				graph.draw(values[index]);
			}

		});
	}


	//var dtime = new Date().getTime();
	canvas.clear();

	//CONSTANTS.distanceCheck = dynDistance.get();
	CONSTANTS.speedScale 		= dynSpeed.get();
	var i = 0;

	for(i = 0, l = particles.length; i < l; i++){
		var particle 	= particles[i];

		particle.translate(particle.vector, {apply: true, scale: CONSTANTS.speedScale});

		if(	particle.x < (0-CONSTANTS.distanceCheck)	||
				particle.x > (canvas.el.width+CONSTANTS.distanceCheck) ||
				particle.y < (0-CONSTANTS.distanceCheck) ||
				particle.y > (canvas.el.height+CONSTANTS.distanceCheck)){
			var x = Math.round(Math.random()*canvas.el.width),
					y = Math.round(Math.random()*canvas.el.height);

			particle.vector.reverse({apply:true});
		}

	}

	for(i = 0, l = particles.length; i < l; i++){
		var slicedParticles = particles.slice(i, particles.length),
				particleCheck 	= particles[i];

		for(var k = 0, p = slicedParticles.length; k < p; k++){
			var part 			= slicedParticles[k],
					distance 	= particleCheck.distanceTo(part);

			if(distance < CONSTANTS.distanceCheck) {
				var opacity = (CONSTANTS.distanceCheck-distance)/CONSTANTS.distanceCheck,
						style 	= 'rgba(255, 255, 255, '+ opacity.toFixed(2) +')';

				part.lineTo(canvas.ctx, particleCheck, {lineWidth: CONSTANTS.lineWidth, strokeStyle: style});
			}
		}

		particleCheck.draw(canvas.ctx, {radius: CONSTANTS.particleSize, fillStyle: CONSTANTS.particleColor});
	}


/*	particles.forEach(function (particle){
		var distance = particle.distanceTo(mouseParticle);

		if(distance < CONSTANTS.distanceCheck) {
			var opacity = (CONSTANTS.distanceCheck-distance)/CONSTANTS.distanceCheck,
					style 	= 'rgba(200, 0, 0, '+opacity.toFixed(2)+')';

			particle.lineTo(canvas.ctx, mouseParticle, {lineWidth: 0.5, strokeStyle: style})
		}
	});*/
	for(i = 0, l = particles.length; i < l; i++){
		particleCheck = particles[i];
		distance 			= particleCheck.distanceTo(mouseParticle);

		if(distance < CONSTANTS.distanceCheck){
			opacity = (CONSTANTS.distanceCheck-distance)/CONSTANTS.distanceCheck;
			style 	= 'rgba(255, 255, 255, '+ opacity.toFixed(2) +')';

			mouseParticle.lineTo(canvas.ctx, particleCheck, {lineWidth: CONSTANTS.lineWidth, strokeStyle: style});
		}
	}

	mouseParticle.draw(canvas.ctx, {radius: CONSTANTS.particleSize * 4, fillStyle:'tomato', strokeStyle: 'tomato'});
	//dtime = new Date().getTime()-dtime;
	//console.log(dtime);

	//console.clear();
	//console.log(CTX.getFFT());

	requestAnimationFrame(draw);
}

window.onmousemove = function (e){
	mouseParticle.moveTo(e.clientX, e.clientY);
};

window.onresize = function(e){
	canvas.init();
};

window.onmousewheel = function (e){
	if(e.deltaY < 0) CONSTANTS.distanceCheck += 10;
	if(e.deltaY > 0) {
		if(CONSTANTS.distanceCheck-10 > 0) CONSTANTS.distanceCheck -= 10;
	}
};

/*
	Update particle distance comparison to only do it for each particle > other particles once

	foreach part, index, arr
		part.distance > (these particles) arr.slice(index, arr.length)
*/
