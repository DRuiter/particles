function Geometry( points ){
	this.points = points;
}

Geometry.prototype.draw = function (ctx, options){
	if(!ctx.canvas || !ctx) throw 'Geometry.draw > No context specified';
	if(!options) options = {};

	var self = this;

	options.fill 		= (typeof options.fill === 'boolean') ? options.fill : true;
	options.stroke 	= (typeof options.stroke === 'boolean') ? options.stroke : true;

	ctx.fillStyle = options.fillStyle || '#ddd';
	ctx.strokeStyle = options.strokeStyle || '#bbb';

	ctx.beginPath();
	ctx.moveTo(this.points[0].x, this.points[0].y);

	this.points.forEach(function (p, i, a){
		if(i === 0) return false;

		ctx.lineTo(p.x, p.y);

		if(i === a.length-1) ctx.lineTo(self.points[0].x, self.points[0].y);
	});

	ctx.closePath();

	if(options.fill) 	ctx.fill();
	if(options.stroke) 	ctx.stroke();
};

Geometry.prototype.width = function(){
	return this.points[1].x-this.points[0].x;
};

Geometry.prototype.height = function(){
	return this.points[0].y-this.points[2].y;
};

Geometry.prototype.getCenter = function (){
	var tx = 0, ty = 0;

	this.points.forEach(function (p){
		tx += p.x;
		ty += p.y;
	});

	return new Point(tx/this.points.length, ty/this.points.length);
};

Geometry.prototype.translate = function (DDVector, options){
	if(!DDVector) throw 'Geometry.translate > No 2Dvector specified';
	if(!options) options = {};

	options.apply 	= options.apply || false;

	var points, tp = [];

	if(options.apply){
		this.points.forEach(function (point){
			point = point.translate(DDVector, options);
		});
	} else {
		points = this.points.slice();

		points.forEach(function (point){
			tp.push(point.translate(DDVector, options));
		});

		return new Geometry(tp);
	}

	return this;
};

Geometry.prototype.clear = function (ctx, options){
	if(!ctx.canvas || !ctx) throw 'Geometry.clear > No context specified';
	if(!options) options = {};

	var self = this;

	ctx.save();
	ctx.globalCompositeOperation = 'destination-out';
	ctx.beginPath();
	ctx.moveTo(this.points[0].x, this.points[0].y);

	this.points.forEach(function (p, i, a){
		if(i === 0) return false;

		ctx.lineTo(p.x, p.y);

		if(i === a.length-1) ctx.lineTo(self.points[0].x, self.points[0].y);
	});

	ctx.closePath();
	ctx.fill();
	ctx.restore();
};

Geometry.prototype.moveTo = function (point){
	var offset = point.get2DVector(this.getCenter());

	this.points.map(function (p){
		p.x += offset.x;
		p.y += offset.y;
	});
};
