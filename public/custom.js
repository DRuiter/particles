CONSTANTS = {
	distanceCheck: 50,
	numberOfParticles: 200,
	particleColor: 'rgb(255,255,255)',
	particleSize: 0.25,
	strokeStyle: 'rgba(255, 255, 255, {$opacity})',
	lineWidth: 0.5,
	speedScale: 0.25
};

canvas 	= new Canvas(document.getElementsByTagName('canvas')[0]);

canvas.init();

var particles = [],
		mouseParticle = new Particle(500, 500);

for(var i = 0, l = CONSTANTS.numberOfParticles; i < l; i++){
	var x = Math.round(Math.random()*canvas.el.width),
			y = Math.round(Math.random()*canvas.el.height);

	particles.push(new Particle(x, y));
}

mouseParticle = particles[0];

window.requestAnimationFrame(draw);

var start = 0;

function draw (e){
/*	if((e-start) > 18)
		console.warn(e-start);
	else
		console.log(e-start);
	start = e;*/

	//var dtime = new Date().getTime();
	canvas.clear();

	//CONSTANTS.distanceCheck = dynDistance.get();
	CONSTANTS.speedScale 		= dynSpeed.get();

	for(var i = 0, l = particles.length; i < l; i++){
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

	for(var i = 0, l = particles.length; i < l; i++){
		var slicedParticles = particles.slice(i, particles.length),
				particleCheck 	= particles[i];

		for(var k = 0, p = slicedParticles.length; k < p; k++){
			var particle 	= slicedParticles[k],
					distance 	= particleCheck.distanceTo(particle);

			if(distance < CONSTANTS.distanceCheck) {
				var opacity = (CONSTANTS.distanceCheck-distance)/CONSTANTS.distanceCheck,
						style 	= 'rgba(255, 255, 255, '+ opacity.toFixed(2) +')';

				particle.lineTo(canvas.ctx, particleCheck, {lineWidth: CONSTANTS.lineWidth, strokeStyle: style});
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

	mouseParticle.draw(canvas.ctx, {radius: CONSTANTS.particleSize, fillStyle:'tomato', strokeStyle: 'tomato'});
	//dtime = new Date().getTime()-dtime;
	//console.log(dtime);

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
