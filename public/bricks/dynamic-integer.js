function DynamicInteger (integer, options){
	if(!options) options = {};

	this._integer 	= integer;
	this._ratio 		= options.ratio || 0.5;

	this._pulseInterval	= options.pulseInterval || 500;
	this._intervalID = undefined;
}

DynamicInteger.prototype._min = function(){
	return this._integer*this._ratio;
};

DynamicInteger.prototype._max = function(){
	return this._integer*(this._ratio+1);
};

DynamicInteger.prototype.value = function(){
	if(!this._pulsing) return this._integer;

	var atAnimationMS 				= (new Date().getTime()-this._pulseStart)%this._pulseDuration,
			atAnimationPercentage	= atAnimationMS/this._pulseDuration;

	return this._min()+(this._integer*atAnimationPercentage);
};
DynamicInteger.prototype.get = DynamicInteger.prototype.value;

DynamicInteger.prototype.set = function (integer){
	this._integer = integer;
};

DynamicInteger.prototype._pulse = function (durationMS, stepMillis){
	var self = this;

	if(!durationMS) durationMS = this._pulseInterval;

	window.clearInterval(this._intervalID);

	var max 		= this._max(),
			min 		= this._min(),
			val 		= this.value(),
			stepMS	= stepMillis ? stepMillis : 16,
			steps 	= Math.floor(durationMS/stepMS),
			stepDec	= (max-val)/steps,
			curStep = 1;

	this.set(max);

	this._intervalID = setInterval(function(){
		if(curStep === steps) {
			self.set(val);
			clearInterval(self._intervalID);
			return false;
		}

		var currentValue = max-(stepDec*curStep);

		self.set(currentValue);
		curStep++;
	}, stepMS);
};

DynamicInteger.prototype.pulse = function (durationMS){
	this._pulsing = true;
	this._pulseStart = new Date().getTime();
	this._pulseDuration = durationMS;
};
