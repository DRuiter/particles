var EventEmitter 	= require('events').EventEmitter,
		press 				= {
			0: 'up',
			1: 'down',
			2: 'left',
			3: 'right',
			4: 'start',
			5: 'back',
			6: 'left-stick',
			7: 'right-stick',
			8: 'LB',
			9: 'RB',
			10: 'A',
			11: 'B',
			12: 'X',
			13: 'Y'
		},
		move 					=  {
			0: 'left-stick',
			1: 'left-stick',
			2: 'right-stick',
			3: 'right-stick',
			4: 'LT',
			5: 'RT'
		};

function XboxControllers (gamepad){
	EventEmitter.call(this);

	var self = this;

	gamepad.on('move', function (id, axis, value){
		var idPrefix 	= id+':',
				eventName	= 'move:'+move[axis];

		self.emit(idPrefix+eventName, {id: id, value: value});
		self.emit(eventName, {id: id, value: value});
	});

	gamepad.on('down', function (id, num) {
		var idPrefix 	= id+':',
				eventName	= 'press:'+press[num];

		self.emit(eventName, {id: id});
		self.emit((idPrefix+eventName), {id: id});
	});
}

XboxControllers.prototype = Object.create(EventEmitter.prototype);

XboxControllers.prototype.press = function (options, callback){
	var key = typeof options === 'object' ? options.key : options,
			eventName = '';

	if(typeof options === 'object' && typeof options.id === 'number'){
		eventName += options.id+':';
	}
	
	eventName += 'press:'+key;

	this.on(eventName, callback);
}

XboxControllers.prototype.move = function (options, callback){
	var key = typeof options === 'object' ? options.key : options,
			eventName;

	if(typeof options === 'object' && typeof options.id === 'number'){
		eventName = options.id+':';
	}
	
	eventName += 'move:'+key;

	this.on(eventName, callback);
}


module.exports = XboxControllers;