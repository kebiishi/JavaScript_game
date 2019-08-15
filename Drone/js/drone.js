var wallNum = 80;
var wall = [];
var timer;

function init() {
	var main = document.getElementById("main");
	for (var i = 0; i < wallNum; i++) {
		wall[i] = document.createElement("div");
		wall[i].style.position = "absolute";
		wall[i].style.top = "100px";
		wall[i].style.left = 10 * i + "px";
		wall[i].style.width = "10px";
		wall[i].style.height = "100px";
		wall[i].style.backgroundColor = "#333333";
		main.appendChild(wall[i]);
	}
	timer = setInterval(mainLoop, 50);
}

function isHit() {

	return false;
}

function mainLoop() {
	if (isHit) {
		clearInterval(timer);
		return;
	}
}