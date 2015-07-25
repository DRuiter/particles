function CustomAudioBuffer(timeMS, options){
  if(!options) options = {};
  TimedBuffer.call(this, timeMS, options);

  this.sampleRate = options.sampleRate || 44100;
  this.minDB      = options.minDB || 0;
  this.maxDB      = options.maxDB || 0;

  return this;
}

CustomAudioBuffer.prototype = Object.create(TimedBuffer.prototype);

CustomAudioBuffer.prototype.getSample = function (timeMS, options){
  if(!timeMS) throw new Error('Missing argument timeMS');
  if(!options) options = {};

  var buffer      = this.getByTime(timeMS),
      average     = this._calculateAverage(buffer);

  if(options.addHistory){
    return this._calculateHistory(average, timeMS);
  } else {
    return average;
  }
};

CustomAudioBuffer.prototype.getLastWithHistory = function (timeMS, options){
  if(!timeMS) throw new Error('Missing argument timeMS');
  if(!options) options = {};

  var last = this.getLast({toArray: true});

  return this._calculateHistory(last, timeMS);
};

CustomAudioBuffer.prototype._calculateAverage = function (buffer){
  if(!buffer.length) return [];

  var average   = [],
      length    = buffer[0].length,
      iterator  = 0;

  //Instantiate with 0 fill
  for(iterator = 0; iterator < length; iterator++){
    average[iterator] = 0;
  }

  //Add values
  buffer.forEach(function (typedArray){
    for(iterator = 0; iterator < length; iterator++){
      average[iterator] += typedArray[iterator];
    }
  });

  //Average values
  return average.map(function (value){
    return value / buffer.length;
  });
};

CustomAudioBuffer.prototype._calculateHistory = function (sample, timeMS){
  if(!sample || !timeMS) throw new Error('Missing arguments');

	var buffer        = this.getByTime(timeMS * 2),
      sortedByBin 	= [],
  		mean,
  		meanDiff,
  		variance,
  		standardDeviation;

	for(var i = 0, l = buffer[0].length; i < l; i++){
		sortedByBin.push([]);
	}

	buffer.forEach(function (sample, index){
    for(var i = 0, l = sample.length; i < l; i++){
      sortedByBin[i].push(sample[i]);
    }
	});

	mean = sortedByBin.map(function (binValues){
		return binValues.reduce(function (prev, cur, index, array){
			if(index === array.length - 1)
				return (prev + cur) / array.length;
			else
				return prev + cur;
		});
	});

	meanDiff = sortedByBin.map(function (binValues, index){
		return binValues.map(function (innerItem, innerIndex){
			return innerItem - mean[index];
		});
	});

	variance = meanDiff.map(function (item, index){
		return item.reduce(function (prev, cur, innerIndex, array){
			if(innerIndex === array.length - 1)
				return (prev+Math.pow(cur, 2)) / array.length;
			else
				return prev+Math.pow(cur, 2);
		});
	});

	standardDeviation = variance.map(function (item, index){
		return Math.round(Math.sqrt(item, 2));
	});

	return sample.map(function (value, index){
    var item = {};

		item.mean 				      = mean[index];
		item.meanDiff			      = value - mean[index];
		item.variance			      = variance[index];
		item.standardDeviation 	= standardDeviation[index];
    item.value              = value;

		return item;
	});
};
