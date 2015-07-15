function CustomAudioBuffer(timeMS, options){
  TimedBuffer.call(this, timeMS, options);

  return this;
}

CustomAudioBuffer.prototype = Object.create(TimedBuffer.prototype);
