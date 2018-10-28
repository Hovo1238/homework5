const canvas = document.getElementById('canvas');
const context = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 800;
const width = 30, height = 30, xDelta = 5, yDelta = 5, colorArr = ['red','green','blue', 'orange','violet','dark blue','grey','black', 'yellow', 'brown'];

const rand = function(num) {
  return Math.floor(Math.random() * num) + 1;
};
const createBoxes = function(count, canvasWidth, canvasHeight) {
		const objects = [];		
		for (let i = 0; i < count; i++) {
			objects[objects.length] = {
				x : rand(canvasWidth - width),
				y : rand(canvasHeight - height),
				width : width,
				height : height,
				xDelta : Math.pow(-1,i) * rand(xDelta),
				yDelta : Math.pow(-1,i) * rand(yDelta),
				colorRange : colorArr,
				color : colorArr[rand(colorArr.length-1)],
				draw : function(){
					context.fillStyle = this.color;
					context.fillRect(this.x,this.y,this.width,this.height);
				},
				update : function(){
					let reflected = false;
					if(this.x + this.width >= canvas.width || this.x <= 0){
						this.xDelta *= -1;
						reflected = true;
					}
					if(this.y + this.height >= canvas.height || this.y <= 0){
						this.yDelta *= -1;
						reflected = true;
					}
					if(reflected) 
					{
						//changing the color
						const prevColor = this.color;
						while(this.color === prevColor)
							this.color = colorArr[rand(colorArr.length-1)];
					}
					this.x += this.xDelta;
					this.y += this.yDelta;
				}
			};
		}
		return objects;
};
const update = function(boxes){
	for(const box of boxes) {
		box.update();
	}
};
const draw = function(boxes){
	for(const box of boxes) {
		box.draw();
	}
};

const loop = function(boxes) {
	context.clearRect(0,0,canvas.width, canvas.height);
	update(boxes);
	draw(boxes);
	requestAnimationFrame(function(){
		loop(boxes);
	});
};

loop(createBoxes(rand(20),canvas.width,canvas.height)); // every time we have random number of boxes with random speed and color