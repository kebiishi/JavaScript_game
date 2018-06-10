var ctx;
var areaX;
var areaY;
var areaWidth = 40;
var snake = [], food = [];
var keyCode = 0;

// Point class
function Point(x, y) {
	this.x = x;
	this.y = y;
}

// initialize
function init() {
	var canvas = document.getElementById("field");
	ctx = canvas.getContext("2d");
	ctx.font = "40px sans-serif";

	// number of areas in x, y direction
	areaX = canvas.width / areaWidth;
	areaY = canvas.height / areaWidth;

	// initialize a snake
	snake.push(new Point(areaX / 2, areaY / 2));
	console.log(snake[0].x + " " + snake[0].y);

	// initialize foods
	for (var i = 0; i < 10; i++) {
		food.push(addFood());
	}
	timer = setInterval(tick, 200);
	window.onkeydown = keydown;
}

function addFood() {
	var x = Math.floor(areaX * Math.random());
	var y = Math.floor(areaY * Math.random());
	var foodPos = new Point(x, y);
	return foodPos;
}

function tick() {
	paint();
}

function keydown(event) {
	switch (event.keyCode) {
		case 37: // left
			snake.forEach(function (i) {
				i.x -= 1;
			});
			break;
		case 38: // up
			snake.forEach(function (i) {
				i.y -= 1;
			});
			break;
		case 39: // right
			snake.forEach(function (i) {
				i.x += 1;
			});
			break;
		case 40: // down
			snake.forEach(function (i) {
				i.y += 1;
			});
			break;
	}
}

// draw
function paint() {
	ctx.clearRect(0, 0, areaX * areaWidth, areaY * areaWidth);
	ctx.fillStyle = "green";
	snake.forEach(function (i) {
		ctx.fillText("●", i.x * areaWidth, i.y * areaWidth);
		console.log(i.x + " " + i.y);
	});
	ctx.fillStyle = "yellow";
	food.forEach(function (i) {
		ctx.fillText("★", i.x * areaWidth, i.y * areaWidth);
	});

}