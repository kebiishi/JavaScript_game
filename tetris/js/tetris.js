const blockSize = 25;

let ctx;
let canvasWidth;
let canvasHeight;

let interval;

let blockUnit = [];
let filledCells = [];
let blockNo = -1;

class BlockUnit {
	constructor() {
		this._width = blockSize;
		this._height = blockSize;
		// 画面の中心からスタート
		this._x = this._width * (canvasWidth / this._width / 2);
		this._y = 0;
	}

	// ブロックが落下する
	moveDown() {
		this._y += this._height;
		this.draw();
	}

	// ブロックを右に移動
	moveRight() {
		// 画面の右端に到達していたらreturn
		if (this._x >= canvasWidth - this._width) {
			return;
		}
		this._x += this._width;
		this.draw();
	}

	// ブロックを左に移動
	moveLeft() {
		// 画面の左端に到達していたらreturn
		if (this._x <= 0) {
			return;
		}
		this._x -= this._width;
		this.draw();
	}

	// ブロックを描画
	draw() {
		console.log(this._x + " " + this._y);
		ctx.beginPath();
		ctx.rect(this._x, this._y, this._width, this._height);
		ctx.fillStyle = "#0095DD";
		ctx.fill();
		ctx.closePath();
	}

	get calcCellXAdress() {
		return this._x / this._width;
	}

	get calcCellYAdress() {
		return this._y / this._height;
	}

	get x() {
		return this._x;
	}
	set x(value) {
		this._x = value;
	}

	get y() {
		return this._y;
	}
	set y(value) {
		this._y = value;
	}

	get width() {
		return this._width;
	}

	set width(value) {
		this._width = value;
	}

	get height() {
		return this._height;
	}

	set height(value) {
		this._height = value;
	}

	get hasDropped() {
		return this._hasDropped;
	}

	set hasDropped(value) {
		this._hasDropped = value;
	}
}

function init() {
	"use strict";
	const canvas = document.getElementById("field");
	canvasWidth = canvas.width;
	canvasHeight = canvas.height;
	ctx = canvas.getContext("2d");

	// 盤面上ですでにブロックで埋まっているセルはtrueとする
	// 初期時点ではすべてfalse
	for (let i = 0; i < (canvasHeight / blockSize) * (canvasWidth / blockSize); i++) {
		filledCells.push(new Array(canvasWidth / blockSize).fill(false));
	}

	interval = setInterval(draw, 700);
}

function checkUnFilledCell(block) {
	let cellX = block.calcCellXAdress;
	let cellY = block.calcCellYAdress;

	// すでに埋まっているセル、
	// もしくは盤面最下部まで落下したら「落下済み」にする
	if (filledCells[cellY][cellX]
			|| cellY === canvasHeight / block.height - 1) {
		block.hasDropped = true;
		filledCells[cellY][cellX] = true;
	}
}

function clearCanvas() {
	// Canvasをクリアする
	ctx.clearRect(0, 0, canvasWidth, canvasHeight);
	// すでに埋まっているセルを描画する
	for (let i = 0; i < filledCells.length; i++) {
		for (let j = 0; j < filledCells[i].length; j++) {
			if (filledCells[i][j]) {
				ctx.beginPath();
				ctx.rect(j * blockSize, i * blockSize, blockSize, blockSize);
				ctx.fillStyle = "#0095DD";
				ctx.fill();
				ctx.closePath();
			}
		}
	}
}

function draw() {
	clearCanvas();

	// ゲーム開始直後のブロック、
	// またはブロックが下まで落下した場合、新たなブロックをNEWする。
	if (blockNo === -1 || blockUnit[blockNo].hasDropped) {
		blockUnit.push(new BlockUnit());
		blockNo++;
		blockUnit[blockNo].draw();
		return;
	}

	blockUnit[blockNo].moveDown();
	checkUnFilledCell(blockUnit[blockNo]);
}

document.addEventListener("keydown", e => {
	clearCanvas();
	if (e.key === "Right" || e.key === "ArrowRight") {
		blockUnit[blockNo].moveRight();
	} else if (e.key === "Left" || e.key === "ArrowLeft") {
		blockUnit[blockNo].moveLeft();
	} else if (e.key === "Down" || e.key === "ArrowDown") {
		blockUnit[blockNo].moveDown();
	}
	checkUnFilledCell(blockUnit[blockNo]);
}, false);

