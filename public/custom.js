canvas 	= new Canvas(document.getElementsByTagName('canvas')[0]);
emitter = new ParticleEmitter(canvas, {
	total: 1500,
	connect: {
		enabled: true
	}
});

var mouseParticle = emitter.particles[0];

mouseParticle.magnitude = 0;

window.requestAnimationFrame(emitter.draw.bind(emitter));

window.onmousemove = function (e){
	mouseParticle.moveTo(e.clientX, e.clientY);
};

window.onresize = function(e){
	canvas.init();
};

window.onmousewheel = function (e){
	if(e.deltaY < 0) emitter.connect.distance += 1;
	if(e.deltaY > 0) {
		if(emitter.connect.distance - 1 > -1) emitter.connect.distance -= 1;
	}
};

window.addEventListener('keydown', function(e){
	//q = 81
	if(e.keyCode === 81) emitter.connect.enabled = !emitter.connect.enabled;
});
