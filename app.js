var stat 						= require('node-static'),
		socketIO				= require('socket.io'),
		http 						= require('http'),
		app 						= http.createServer(handler),
		io 							= require('socket.io')(app),
		front 					= new stat.Server('./public'),
		port 						= 8080,
		controllers;

function handler (req, res) {
  req.addListener('end', function () {
    front.serve(req, res);
  }).resume();
}

console.log('App listening on: ', port);

app.listen(port);


io.on('connection', function (socket) {
	console.log(socket.id, ' Connected');
});
