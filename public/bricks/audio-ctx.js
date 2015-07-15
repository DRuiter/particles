function AudioCtx(AudioElement, options){
  if(!options) options = {};

  //Default to 512 for 256 bands of precision
  options.FFTSize = options.FFTSize || 512;
  options.FFTType = options.FFTType || 'byte';

  this.el       = AudioElement;
  this.ctx      = new AudioContext();
  this.src      = this.ctx.createMediaElementSource(this.el);
  this.analyser = this.ctx.createAnalyser();
  this.options  = options;

  this.analyser.fftSize = options.FFTSize;

  this.src.connect(this.analyser);
  this.analyser.connect(this.ctx.destination);

  this.hertzPerBand = this.ctx.sampleRate / (options.FFTSize / 2);
}

AudioCtx.prototype.getFFT = function(type){
  if(!type) type = this.options.FFTType;

  var returnValue;

  switch(type){
    case 'float':
      returnValue = new Float32Array(this.analyser.frequencyBinCount);
      this.analyser.getFloatFrequencyData(returnValue);
    break;

    case 'byte':
      returnValue = new Uint8Array(this.analyser.frequencyBinCount);
      this.analyser.getByteFrequencyData(returnValue);
    break;

    case 'vanilla':
      returnValue = [];
      var temp = new Uint8Array(this.analyser.frequencyBinCount);
      this.analyser.getByteFrequencyData(temp);

      for(var i = 0, l = temp.length; i < l; i++){
        returnValue.push(temp[i]);
      }
    break;
  }

  return returnValue;
};

AudioCtx.prototype.isPlaying = function(){
  return !this.el.paused;
};
