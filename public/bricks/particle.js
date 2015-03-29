function Particle (x, y){
	Point.call(this, x, y);

	var vx = Math.round(Math.random()*2)-Math.round(Math.random()*4),
			vy = Math.round(Math.random()*2)-Math.round(Math.random()*4);

	while(vx === 0 && vy === 0){
		vx = Math.round(Math.random()*2)-Math.round(Math.random()*4);
		vy = Math.round(Math.random()*2)-Math.round(Math.random()*4);
	}

	this.vector = new DDVector(vx, vy);
	this.bounding = 75;
}

Particle.prototype = Object.create(Point.prototype);

Particle.prototype.draw = function(ctx, options){
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

Particle.prototype.getBoundingBox = function (override){
	var bounding 	= override || this.bounding,
			bValue		= bounding/2,
			box 			= [
				new Point(this.x-bValue, this.y-bValue), //tl
				new Point(this.x+bValue, this.y-bValue), //tr
				new Point(this.x+bValue, this.y+bValue), //br
				new Point(this.x-bValue, this.y+bValue)  //bl
			];

	return new Geometry(box);
};

Particle.prototype.drawBoundingBox = function (ctx, options){
	if(!ctx.canvas || !ctx) throw 'Particle.drawBoundingBox > No context specified';
	if(!options) options = {};

	options.fill = options.fill || false;
	options.stroke = typeof options.stroke === 'boolean' ? options.stroke : true;

	this.getBoundingBox().draw(ctx, options);

	return this;
};

Particle.prototype.isIntersecting = function (particle){
	var rect1 = this.getBoundingBox(),
			rect2 = particle.getBoundingBox(),
			r1 		= {
				top: 		rect1.points[0].y,
				left: 	rect1.points[0].x,
				right: 	rect1.points[1].x,
				bottom: rect1.points[2].y
			},
			r2 		= {
				top: 		rect2.points[0].y,
				left: 	rect2.points[0].x,
				right: 	rect2.points[1].x,
				bottom: rect2.points[2].y
			};

	return !(r2.left > r1.right ||
		 			r2.right < r1.left 	||
					r2.top > r1.bottom	||
					r2.bottom < r1.top);
};
