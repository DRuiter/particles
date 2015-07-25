function Canvas(element){
	this.el 			= element;
	this.ctx 			= element.getContext('2d');
	this.bgcolor	= element.style.backgroundColor;

	return this.init();
}

Canvas.prototype.init = function(width, height){
	this.el.width 	= width || window.innerWidth;
	this.el.height	= height || window.innerHeight;

	return this;
};

Canvas.prototype.clear = function(){
	this.ctx.clearRect(0, 0, this.el.width, this.el.height);
};
