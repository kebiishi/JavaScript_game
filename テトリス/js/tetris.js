/*
 * 定数
 */
// ブロックの1辺のサイズ[px]
const BLOCK_SIZE = 20;
// ブロック数
const COL_BLOCK_NUM = 20;
const ROW_BLOCK_NUM = 25;
// 1フレームの時間間隔[ms]
const DELAY = 700;

/*
 * グローバル変数
 */
let interval;
// 盤面上の各セルにブロックがあるかを保持する
let blocks = [];
let fallingBloks = [];

/*
 * 初期化
 */
function init() {
	"use strict";
	drawBoard();

	// 盤面上のブロックを初期化する。
	blocks = Array.from(new Array(ROW_BLOCK_NUM), () => new Array(COL_BLOCK_NUM).fill(0));

	fallingBloks.push({
		row: -1,
		col: 0
	});
	// blocks[0][0] = 2
	// const board = document.getElementById("board");
	// const tr = board.children[0];
	// const td = tr.children[0];
	// td.style.backgroundColor = "#AA0000";
	//

	interval = setInterval(draw, DELAY);
}

/*
 * 盤面を描画する
 */
function drawBoard() {
	const board = document.getElementById("board");
	board.style.width = BLOCK_SIZE * COL_BLOCK_NUM + "px";
	board.style.height = BLOCK_SIZE * ROW_BLOCK_NUM + "px";
	// 盤面のマス目を作成する。
	for (let i=0; i < ROW_BLOCK_NUM; i++) {
		let tr = document.createElement("tr");
		for (let j=0; j < COL_BLOCK_NUM; j++) {
			let td = document.createElement("td");
			td.style.width = BLOCK_SIZE + "px";
			td.style.height = BLOCK_SIZE + "px";
			tr.appendChild(td);
		}
		board.appendChild(tr);
	}
}

/*
 *
 */
function draw() {
	const board = document.getElementById("board");
	fallingBloks.map(e => e.row++);
	// fallingBloks.map(e => e.row === 0 ? e.row : e.row++);
	fallingBloks.forEach(e => blocks[e.row][e.col] = 2);
	blocks.forEach((row, i) => {
		row.filter(cell => cell ===2)
			.forEach((cell,j) => {
				if (i > 0) {
					board.children[i-1].children[j].style.backgroundColor = "transparent";
				}
				board.children[i].children[j].style.backgroundColor = "#AA0000";
			});
	});

}

// 	blockUnit[blockNo].moveDown();
// 	checkUnFilledCell(blockUnit[blockNo]);
// }
//
// document.addEventListener("keydown", e => {
// 	clearCanvas();
// 	if (e.key === "Right" || e.key === "ArrowRight") {
// 		blockUnit[blockNo].moveRight();
// 	} else if (e.key === "Left" || e.key === "ArrowLeft") {
// 		blockUnit[blockNo].moveLeft();
// 	} else if (e.key === "Down" || e.key === "ArrowDown") {
// 		blockUnit[blockNo].moveDown();
// 	}
// 	checkUnFilledCell(blockUnit[blockNo]);
// }, false);
//
// class BlockUnit {
// 	constructor() {
// 		this._width = blockSize;
// 		this._height = blockSize;
// 		// 画面の中心からスタート
// 		this._x = this._width * (canvasWidth / this._width / 2);
// 		this._y = 0;
// 	}
//
// 	// ブロックが落下する
// 	moveDown() {
// 		this._y += this._height;
// 		this.draw();
// 	}
//
// 	// ブロックを右に移動
// 	moveRight() {
// 		// 画面の右端に到達していたらreturn
// 		if (this._x >= canvasWidth - this._width) {
// 			return;
// 		}
// 		this._x += this._width;
// 		this.draw();
// 	}
//
// 	// ブロックを左に移動
// 	moveLeft() {
// 		// 画面の左端に到達していたらreturn
// 		if (this._x <= 0) {
// 			return;
// 		}
// 		this._x -= this._width;
// 		this.draw();
// 	}
//
// 	// ブロックを描画
// 	draw() {
// 		console.log(this._x + " " + this._y);
// 		ctx.beginPath();
// 		ctx.rect(this._x, this._y, this._width, this._height);
// 		ctx.fillStyle = "#0095DD";
// 		ctx.fill();
// 		ctx.closePath();
// 	}
//
// 	get calcCellXAdress() {
// 		return this._x / this._width;
// 	}
//
// 	get calcCellYAdress() {
// 		return this._y / this._height;
// 	}
//
// 	get x() {
// 		return this._x;
// 	}
// 	set x(value) {
// 		this._x = value;
// 	}
//
// 	get y() {
// 		return this._y;
// 	}
// 	set y(value) {
// 		this._y = value;
// 	}
//
// 	get width() {
// 		return this._width;
// 	}
//
// 	set width(value) {
// 		this._width = value;
// 	}
//
// 	get height() {
// 		return this._height;
// 	}
//
// 	set height(value) {
// 		this._height = value;
// 	}
//
// 	get hasDropped() {
// 		return this._hasDropped;
// 	}
//
// 	set hasDropped(value) {
// 		this._hasDropped = value;
// 	}
// }


// function checkUnFilledCell(block) {
// 	let cellX = block.calcCellXAdress;
// 	let cellY = block.calcCellYAdress;
//
// 	// すでに埋まっているセル、
// 	// もしくは盤面最下部まで落下したら「落下済み」にする
// 	if (filledCells[cellY][cellX]
// 			|| cellY === canvasHeight / block.height - 1) {
// 		block.hasDropped = true;
// 		filledCells[cellY][cellX] = true;
// 	}
// }
//
// function clearCanvas() {
// 	// Canvasをクリアする
// 	ctx.clearRect(0, 0, canvasWidth, canvasHeight);
// 	// すでに埋まっているセルを描画する
// 	for (let i = 0; i < filledCells.length; i++) {
// 		for (let j = 0; j < filledCells[i].length; j++) {
// 			if (filledCells[i][j]) {
// 				ctx.beginPath();
// 				ctx.rect(j * blockSize, i * blockSize, blockSize, blockSize);
// 				ctx.fillStyle = "#0095DD";
// 				ctx.fill();
// 				ctx.closePath();
// 			}
// 		}
// 	}
// }
//
