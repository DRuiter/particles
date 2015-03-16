function Rhythm(){
	this.map = {};
	this.bpm = 1;

	this.taps = [];
	this.beatIntervalID;
}

Rhythm.prototype._calculateBPM = function(){
	if(this.taps.length <= 1){
		return false;
	}

	return this.taps
		.map(function (item, index, array){
			if(index === array.length){
				return false
			}

			var reverseIndex 	= array.length-index,
					diffMS 				= Math.abs(array[reverseIndex]-array[reverseIndex-1]);

			return diffMS;		
		})
		.filter(Boolean)
		.reduce(function (prev, cur, index, array){
			if(index === array.length-1){
				return (prev+cur)/array.length
			}

			return prev+cur;
		});
}

Rhythm.prototype.tap = function(){
	var self = this;

	this.taps.push(new Date().getTime());

	if(this.taps.length > 10){
		this.taps = [];
	}

	var calculatedBPM = this._calculateBPM();

	if(calculatedBPM) {
		this.bpm = calculatedBPM;
		this.emit('bpm', this.bpm, this);

		window.clearInterval(this._beatInterval);

		this._beatInterval = window.setInterval(function(){
			self.emit('beat', self.bpm, self);
		}, this.bpm);
	}
}

Rhythm.prototype.on = function(eventName, callback){
	if(this.map[eventName]){
		this.map[eventName].push(callback);
	} else {
		this.map[eventName] = [callback];
	}
}

Rhythm.prototype.emit = function(eventName, data){
	if(this.map[eventName]){
		this.map[eventName].forEach(function (callback){
			callback(data);
		});
	}
}