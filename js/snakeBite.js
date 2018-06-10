var width;
var height;
var areaNum = 20;
var snake = [], food = [];
var keyCode = 0;

// 初期化関数
function init() {
	var canvas = document.getElementById("field");
	width = canva.width / areaNum;
	height = canva.height / areaNum;
	ctx = canvas.getContext("2d");
	ctx.font = "20px sans-serif";

	// 蛇の初期化
	snake.push(new Point(width / 2., height / 2.));

	// 餌の初期化
	for (var i = 0; i < 10; i++) {
		food.push(addFood());
	}
	timer = setInterval(tick, 200);
	window.onkeydown = keydown;
}

// 餌を追加
function addFood() {

}

function tick() {

}

function keydown() {

}

// 描画
function paint() {

}