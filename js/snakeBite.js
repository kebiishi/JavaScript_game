var ctx;
var areaX;
var areaY;
var areaWidth = 40;
var snake = [], foods = [];
var keyCode = 0;
var timer;
var score = 0;

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

	// initialize foods
	for (var i = 0; i < 10; i++) {
		addFood();
	}
	timer = setInterval(tick, 200);
	window.onkeydown = keydown;
}

function tick() {
	x = snake[0].x;
	y = snake[0].y;
	switch (keyCode) {
		case 37: // left
			x--;
			break;
		case 38: // up
			y--;
			break;
		case 39: // right
			x++;
			break;
		case 40: // down
			y++;
			break;
		default:
			paint();
			return;
	}
	if (isHit(snake, x, y)
		|| x < 0 || areaX <= x
		|| y < 0 || areaY <= y) {
		clearInterval(timer);
		paint();
		return;
	}
	snake.unshift(new Point(x, y));
	if (isHit(foods, x, y)) {
		score += 10;
		moveFood(x, y);
	} else {
		snake.pop(snake.length - 1);
	}
	paint();
}

function keydown(event) {
	keyCode = event.keyCode;
}

// collision detection
function isHit(data, x, y) {
	for (var i = 0; i < data.length; i++) {
		if (data[i].x == x && data[i].y == y) {
			return true;
		}
	}
	return false;
}

function addFood() {
	while(true) {
		var x = Math.floor(areaX * Math.random());
		var y = Math.floor(areaY * Math.random());
		if (isHit(foods, x, y) || isHit(snake, x, y)) {
			continue;
		}
		foods.push(new Point(x, y));
		break;
	}
}

function moveFood(x, y) {
	foods = foods.filter(function (i) {
		return i.x != x || i.y != y;
	});
	addFood();
}

// draw
function paint() {
	ctx.clearRect(0, 0, areaX * areaWidth, areaY * areaWidth);
	ctx.fillStyle = "red";
	ctx.fillText(score, areaWidth, areaWidth * 2);
	ctx.fillStyle = "green";
	snake.forEach(function (i) {
		ctx.fillText("●", i.x * areaWidth, (i.y + 1) * areaWidth);
	});
	ctx.fillStyle = "yellow";
	foods.forEach(function (i) {
		ctx.fillText("★", i.x * areaWidth, (i.y + 1) * areaWidth);
	});

}