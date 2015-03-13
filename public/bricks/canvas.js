function Canvas(element){
	this.el 	= element;
	this.ctx 	= element.getContext('2d');
	this.bgcolor= element.style.backgroundColor;

	return this;
}

Canvas.prototype.init = function(){
	this.el.width 	= window.innerWidth;
	this.el.height	= window.innerHeight;

	return this;
}

Canvas.prototype.clear = function(){
	this.ctx.clearRect(0, 0, this.el.width, this.el.height);
}