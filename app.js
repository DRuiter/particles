var fs 							= require('fs'),
		gamepad 				= require('gamepad'),
		XboxControllers	= require('./config/XboxControllers'),
		static 					= require('node-static'),
		socketIO				= require('socket.io'),
		http 						= require('http'),
		app 						= http.createServer(handler),
		io 							= require('socket.io')(app),
		front 					= new static.Server('./public'),
		port 						= 8080,
		controllers;

function handler (req, res) {
  req.addListener('end', function () {
    front.serve(req, res);
  }).resume();
}

console.log('App listening on: ', port);

app.listen(port);

gamepad.init();
setInterval(gamepad.processEvents, 50);
setInterval(gamepad.detectDevices, 1500);

controllers = new XboxControllers(gamepad);

io.on('connection', function (socket) {
	console.log(socket.id, ' Connected');

	// List the state of all currently attached devices
	for (var i = 0, l = gamepad.numDevices(); i < l; i++) {
	  console.log(i, gamepad.deviceAtIndex());
	}

	controllers.press('A', function (data){
		socket.emit('tap');
	});
});
