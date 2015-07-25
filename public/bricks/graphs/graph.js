function BarGraph(ctx, options){
  if(!ctx || !ctx.canvas) throw new Error('Missing argument: ctx');
  if(!options) this.options = options = {};

  this.options.maxValue = options.maxValue || 255;
  this.options.minValue = options.minValue || 0;

  this.ctx = ctx;
}

BarGraph.prototype.draw = function(data){
  if(!data || !data.length) throw new Error('Incorrect argument: data');

  var width     = this.ctx.canvas.width,
      height    = this.ctx.canvas.height,
      bars      = data.length,
      barWidth  = width / bars;

  this.ctx.clearRect(0, 0, width, height);
  this.ctx.beginPath();
  this.ctx.fillStyle = '#ffffff';

  data.forEach(function(value, index){
    var w = barWidth,
        h = (value / (this.options.maxValue) * height),
        x = index * barWidth,
        y = height - h;

    this.ctx.rect(x, y, w, h);

  }, this);

  this.ctx.closePath();
  this.ctx.fill();
};
