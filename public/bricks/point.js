function Point(x, y){
	this.x = x;
	this.y = y;

	return this;
}

Point.prototype.draw = function (ctx, options){
	if(!ctx.canvas || !ctx) throw 'Point.draw > No context specified';
	if(!options) options = {};

	ctx.fillStyle = options.fillStyle || 'red';
	ctx.strokeStyle = options.strokeStyle || '#ddd';

	var radius = options.radius || 1.5;

	ctx.beginPath();
	ctx.arc(this.x, this.y, radius, 0, Math.PI*2, true);
	ctx.closePath();
	ctx.fill();

	return this;
};

Point.prototype.moveTo = function (x, y){
	this.x = x;
	this.y = y;
};

Point.prototype.lineTo = function (ctx, Point, options){
	if(!ctx.canvas || !ctx) throw 'Point.lineTo > No context specified';
	if(!options) options = {};

	ctx.strokeStyle = options.strokeStyle || 'green';
	ctx.lineWidth 	= options.lineWidth || 2;

	ctx.beginPath();
	ctx.moveTo(this.x, this.y);
	ctx.lineTo(Point.x, Point.y);
	ctx.closePath();
	ctx.stroke();

	return this;
};

Point.prototype.distanceTo = function (Point){
	var xs = Point.x - this.x;
  var ys = Point.y - this.y;

  return Math.sqrt( (xs * xs) + (ys * ys));
};

Point.prototype.copy = function (){
	return new Point(this.x, this.y);
};

Point.prototype.get2DVector = function (Point, options){
	if(!options) options = {};

	options.reverse = options.reverse || false;

	var x,y;

	if(!options.reverse) {
		x = this.x-Point.x;
		y = this.y-Point.y;
	} else {
		x = Point.x-this.x;
		y = Point.y-this.y;
	}

	return new DDVector(x, y);
};

Point.prototype.translate = function (DDVector, options) {
	if(!DDVector) throw 'Point.translate > No 2DVector specified';
	if(!options) options = {};

	options.scale = options.scale || 1;
	options.apply = options.apply || false;

	var x = this.x+(DDVector.x*options.scale),
			y = this.y+(DDVector.y*options.scale);

	if(options.apply){
		this.x = x;
		this.y = y;
	} else {
		return new Point(x, y);
	}
};

Point.prototype.offset = function (x, y, options){
	if(!options) options = {};

	options.apply = options.apply || false;

	if(options.apply){
		this.x = this.x+x;
		this.y = this.y+y;
	} else {
		return new Point(this.x+x, this.y+y);
	}
};
