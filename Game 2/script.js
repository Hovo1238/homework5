const canvas = document.getElementById('canvas');
const context = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 800;
const width = 30, height = 30;
let Delta = 1;
const leftKey = 37, upKey = 38,rightKey = 39,downKey = 40;
const  goodGuyImg = new Image();
goodGuyImg.src = 'student.png';
const badGuyImg = new Image();
badGuyImg.src = 'fail.png';
let LevelChanged = false, GameOver = false;;

const rand = function(num) {
  return Math.floor(Math.random() * num) + 1;
};
const createCharacters = function(count, canvasWidth, canvasHeight,img) {
		const characters = [];		
		for (let i = 0; i < count; i++) {
			characters[characters.length] = {
				x : rand(canvasWidth - width),
				y : rand(canvasHeight - height),
				width : width,
				height : height,
				xDelta : Math.pow(-1,rand(2)) * Delta,
				yDelta : Math.pow(-1,rand(2)) * Delta,
				image : img,
				draw : function(){
					context.drawImage(this.image,this.x,this.y,this.width,this.height);
				},
				update : function(){
					if(this.x + this.width >= canvas.width || this.x <= 0)
						this.xDelta *= -1;
					if(this.y + this.height >= canvas.height || this.y <= 0)
						this.yDelta *= -1;
					this.x += this.xDelta;
					this.y += this.yDelta;
				}
			};
		}
		return characters;
};
const update = function(gameData){
	gameData.hero.update();
	for(const badGuy of gameData.badGuys) {
		badGuy.update();
	}
};
const draw = function(gameData){
	gameData.hero.draw();
	for(const badGuy of gameData.badGuys) {
		badGuy.draw();
	}
};


const gameOver = function(gameData){
	const hero = gameData.hero;
	const centerHero = {
		x : hero.x + hero.width/2,
		y : hero.y + hero.height/2
	};
	let runningBadGuyCenter = {};

	for(const badGuy of gameData.badGuys) {
		runningBadGuyCenter = {
			x : badGuy.x + badGuy.width/2,
			y : badGuy.y + badGuy.height/2
		};
		const distance = Math.sqrt(Math.pow(Math.abs(runningBadGuyCenter.x - centerHero.x),2) + Math.pow(Math.abs(runningBadGuyCenter.y - centerHero.y),2))
		const minDist = Math.sqrt(Math.pow((hero.width + badGuy.width)/2,2) + Math.pow((hero.height + badGuy.height)/2,2));
		if( distance < minDist - 15 ) {
			console.log(Math.abs(runningBadGuyCenter.x - centerHero.x));
			console.log((hero.width + badGuy.width)/2 );
			return true;
		}
	}

	return false;
};


const gameData = {
	hero : createCharacters(1,canvas.width,canvas.height,goodGuyImg)[0],
	badGuys : createCharacters(1,canvas.width,canvas.height,badGuyImg),
	level : 1
};

//level up
setTimeout(function(){
	levelUp();
},5000);
const levelUp = function(){
	if(!GameOver){
		alert("You reached level " + ++(gameData.level));
		Delta++;
		gameData.hero = createCharacters(1,canvas.width,canvas.height,goodGuyImg)[0];
		gameData.badGuys = createCharacters(gameData.level,canvas.width,canvas.height,badGuyImg);
		setTimeout(levelUp,7000);
		LevelChanged = true;
	}
};



const loop = function(gameData) {
	context.clearRect(0,0,canvas.width, canvas.height);
	if(gameOver(gameData))
	{
		alert('Game over ! Your level is ' + gameData.level);
		GameOver = true;
	}
	else{
		update(gameData);
		draw(gameData);
		if(LevelChanged){
			LevelChanged = false;
			setTimeout(function(){
				requestAnimationFrame(function(){
					loop(gameData);
				});
			},1000);
		}
		else
		{
			requestAnimationFrame(function(){
				loop(gameData);
			});
		}
	}
};

document.addEventListener('keydown', function(event) {
	const hero = gameData.hero;
	switch(event.keyCode)	{
		case upKey: 
					hero.xDelta = 0;
					hero.yDelta = -Delta;
					break;
		case downKey: 
					hero.xDelta = 0;
					hero.yDelta = Delta;
					break;
		case rightKey: 
					hero.xDelta = Delta;
					hero.yDelta = 0;
					break;
		case leftKey:
					hero.xDelta = -Delta;
					hero.yDelta = 0;
					break;
	}
}, false);

loop(gameData);