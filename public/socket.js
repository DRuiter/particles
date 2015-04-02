var socket 			= io('http://localhost:8080'),
		rhythm 			= new Rhythm(),
		dynDistance = new DynamicInteger(100),
		dynSpeed 		= new DynamicInteger(0.25, {ratio:0.5});

rhythm.on('beat', function (bpm){
	console.log(bpm);
	dynDistance.pulse(bpm-(bpm/10));
	dynSpeed.pulse(bpm-(bpm/10));
});

socket.on('move', function (data) {
  console.log(data);
});

socket.on('tap', function (data) {
  rhythm.tap();
});
