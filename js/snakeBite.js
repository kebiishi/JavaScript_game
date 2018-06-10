var ctx;
var areaX;
var areaY;
var areaWidth = 40;
var snake = [], food = [];
var keyCode = 0;

// Pointクラス
function Point(x, y) {
	this.x = x;
	this.y = y;
}

// 初期化関数
function init() {
	var canvas = document.getElementById("field");
	ctx = canvas.getContext("2d");
	ctx.font = "40px sans-serif";

	// x方向、y方向のマスの数
	areaX = canvas.width / areaWidth;
	areaY = canvas.height / areaWidth;
	console.log(canvas.width + " " + canvas.height);
	console.log(areaX + " " + areaY);

	// 蛇の初期化
	snake.push(new Point(areaX / 2, areaY / 2));

	// 餌の初期化
	for (var i = 0; i < 10; i++) {
		food.push(addFood());
	}
	timer = setInterval(tick, 200);
	window.onkeydown = keydown;
}

// 餌を追加
function addFood() {
	var x = Math.floor(areaX * Math.random());
	var y = Math.floor(areaY * Math.random());
	var foodPos = new Point(x, y);
	return foodPos;
}

function tick() {
	paint();
}

function keydown() {

}

// 描画
function paint() {
	ctx.clearRect(0, 0, areaX * areaWidth, areaY * areaWidth);
	ctx.fillStyle = "green";
	snake.forEach(function (i) {
		ctx.fillText("●", i.x * areaWidth, i.y * areaWidth);
	});
	ctx.fillStyle = "yellow";
	food.forEach(function (i) {
		ctx.fillText("*", i.x * areaWidth, i.y * areaWidth);
	});

}