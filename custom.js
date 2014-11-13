CONSTANTS = {
	distanceCheck: 150
}

canvas 	= new Canvas(document.getElementsByTagName('canvas')[0]);

canvas.init();

var particles = [],
		mouseParticle = new Particle(500, 500);

for(var i = 0, l = 150; i < l; i++){
	var x = Math.random()*canvas.el.width,
			y = Math.random()*canvas.el.height;

	particles.push(new Particle(x, y));
}




mouseParticle = particles[0];

window.requestAnimationFrame(draw);

function draw (e){
	var dtime = new Date().getTime();
	canvas.clear();

	function distanceCheck (particleCheck){
		particles.forEach(function (particle){
			var distance = particleCheck.distanceTo(particle);
			
			if(distance < CONSTANTS.distanceCheck) {
				var opacity = (CONSTANTS.distanceCheck-distance)/CONSTANTS.distanceCheck,
					style 	= 'rgba(200, 0, 0, '+opacity.toFixed(1)+')';

				particle.lineTo(canvas.ctx, particleCheck, {lineWidth: 0.1, strokeStyle: style})
			}
		})
	}
	
	particles.forEach(distanceCheck)
	

	particles.forEach(function (particle){
		particle.draw(canvas.ctx, {radius:0.5});
		var distance = particle.distanceTo(mouseParticle);
		
		if(distance < CONSTANTS.distanceCheck) {
			var opacity = (CONSTANTS.distanceCheck-distance)/CONSTANTS.distanceCheck,
					style 	= 'rgba(200, 0, 0, '+opacity.toFixed(2)+')';

			particle.lineTo(canvas.ctx, mouseParticle, {lineWidth: 0.1, strokeStyle: style})
		}
	});

	mouseParticle.draw(canvas.ctx, {radius: 1.5, fillStyle:'green', strokeStyle: 'green'});
	dtime = new Date().getTime()-dtime;
	console.log(dtime);

	window.requestAnimationFrame(draw);
}

window.onmousemove = function (e){
	mouseParticle.moveTo(e.clientX, e.clientY);
}

window.onresize = function(e){
	canvas.init();
}

window.onmousewheel = function (e){
	if(e.deltaY < 0) CONSTANTS.distanceCheck += 10;
	if(e.deltaY > 0) {
		if(CONSTANTS.distanceCheck-10 > 0) CONSTANTS.distanceCheck -= 10;
	}
}

/*
	Update particle distance comparison to only do it for each particle > other particles once

	foreach part, index, arr
		part.distance > (these particles) arr.slice(index, arr.length)
*/