/**
 * 定数
 */
// ブロックの1辺のサイズ[px]
const BLOCK_SIZE = 20;
// ブロック数
const COL_BLOCK_NUM = 20;
const ROW_BLOCK_NUM = 25;
// 1フレームの時間間隔[ms]
const DELAY = 700;
// const DELAY = 200;
// パーツの名称
const PARTS = ["square", "l-shaped", "anti-l-shaped", "t-shaped", "s-shaped", "anti-s-shaped", "stick"];
// 回転角の名称
const ROTATION = ["0", "90", "180", "270"];

/**
 * グローバル変数
 */
let interval;
// 盤面上の各セルにブロックがあるかを保持する
let blocks = [];
// 落下中のパーツ
let fallingParts = [];

/**
 * 初期化
 */
function init() {
	"use strict";
	drawBoard();

	// 盤面上のブロックを初期化する。
	blocks = Array.from(new Array(ROW_BLOCK_NUM), () => new Array(COL_BLOCK_NUM).fill(0));

	interval = setInterval(draw, DELAY);
}

/**
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

/**
 * 盤面を初期化（ブロックを非可視に）。
 */
function clearBoard() {
	const board = document.getElementById("board");
	Array.from(board.children).forEach(tr => {
		Array.from(tr.children).forEach(td =>
			td.style.backgroundColor = "transparent"
		);
	});
}

/**
 * 新しいパーツの形状、初期位置を返す。
 * @returns {Object} 新しいパーツの定義
 */
function selectNewParts() {
	// パーツの種類をランダムに決定する。
	const pattern = PARTS[Math.floor(Math.random() * PARTS.length)];
	// 回転角をランダムに決定する。
	const angle = ROTATION[Math.floor(Math.random() * ROTATION.length)];
	return {
			pattern: pattern,
			angle: angle,
			row: -1,
			col: 0
		};
}

/**
 * 新しいブロックを生成し、配列を返す。
 * @returns {Object} 新しいブロック
 */
function createNewParts(parts) {
	return [
		{
			row: -1,
			col: 0
		},
		{
			row: -1,
			col: 1
		},
		{
			row: 0,
			col: 0
		},
		{
			row: 0,
			col: 1
		}
	];
}

/**
 * ブロックのあるセルの背景色をセット。
 */
function paintBGColor() {
	// 落下中のブロックを描画。
	if (fallingParts.length > 0) {
		fallingParts.forEach(p => {
			board.children[p.row].children[p.col].style.backgroundColor = "#AA0000";
		})
	}
	// 落下済みのブロックを描画。
	blocks.forEach((row, i) => {
		row.forEach((cell,j) => {
			if (cell) {
				board.children[i].children[j].style.backgroundColor = "#AA0000";
			}
		});
	});
}

/**
 * ブロックを移動
 * @param {String} dir 移動する方向
 */
function moveBlock(dir) {
	switch (dir) {
		case "down":
			// 1行落下。
			fallingParts.map(p => p.row++);
			// fallingParts.row++;
			// // ブロック配列を更新。
			// fallingParts.forEach(e => {
			// 	// 落下し始めはスキップ。
			// 	if (e.row > 0) {
			// 		blocks[e.row - 1][e.col] = 0;
			// 	}
			// 	blocks[e.row][e.col] = 1;
			// });
			break;
		case "right":
			// 右に移動可能な領域を制限する。
			if (fallingParts.some(p => (p.col === COL_BLOCK_NUM - 1))) {
			// if (fallingParts.col === COL_BLOCK_NUM - 1) {
				return;
			};
			// 1列右に移動。
			fallingParts.map(p => p.col++);
			// fallingParts.col++;
			// // ブロック配列を更新。
			// fallingParts.forEach(e => {
			// 	blocks[e.row][e.col - 1] = 0;
			// 	blocks[e.row][e.col] = 1;
			// });
			break;
		case "left":
			// 左に移動可能な領域を制限する。
			if (fallingParts.some(p => p.col === 0)) {
			// if (fallingParts.col === 0) {
				return;
			};
			// 1列左に移動。
			fallingParts.map(p => p.col--);
			// fallingParts.col--;
			// ブロック配列を更新。
			// fallingParts.forEach(e => {
			// 	blocks[e.row][e.col + 1] = 0;
			// 	blocks[e.row][e.col] = 1;
			// });
			break;
		default:
			break;
	}
}

/**
 * 落下したかどうかを判定する。
 * 最下部まで落下、もしくは直下のセルがすでに埋まっている場合、落下完了とする。
 */
function hasFallen() {
	// fallingParts.forEach(e => {
	// 	if (e.row === ROW_BLOCK_NUM - 1 || blocks[e.row + 1][e.col] === 1) {
	// 		fallingParts.length = 0;
	// 	}
	// })
	if (fallingParts.some(p => p.row === ROW_BLOCK_NUM - 1)) {
		return true;
	}
	if (fallingParts.some(p => blocks[p.row + 1][p.col] === 1)) {
		return true;
	}
	return false;
}

/**
 *
 */
function draw() {
	const board = document.getElementById("board");
	// 盤面をクリア。
	clearBoard();

	// ブロックが落下し終わったら新しいブロックを生成。
	if (!fallingParts.length) {
		fallingParts = createNewParts(selectNewParts());
	}

	// 落下。
	moveBlock("down");

	// 背景色を塗る。
	paintBGColor();

	// 落下完了判定。
	if (hasFallen()) {
		// 「落下中」から「落下済み」に移す。
		fallingParts.forEach(p => blocks[p.row][p.col] = 1);
		fallingParts.length = 0;
	}
}

document.addEventListener("keydown", e => {
	// 落下中のブロックがない場合は処理をスキップする。
	if (!fallingParts.length) {
		return;
	}
	// 盤面をクリア。
	clearBoard();
	if (e.key === "Right" || e.key === "ArrowRight") {
		// 右に移動。
		moveBlock("right");
	} else if (e.key === "Left" || e.key === "ArrowLeft") {
		// 左に移動。
		moveBlock("left");
	} else if (e.key === "Down" || e.key === "ArrowDown") {
		// 下に移動。
		moveBlock("down");
		// 落下完了判定。
		if (hasFallen()) {
			// 「落下中」から「落下済み」に移す。
			fallingParts.forEach(p => blocks[p.row][p.col] = 1);
			fallingParts.length = 0;
		}
	}
	// 背景色を塗る。
	paintBGColor();
}, false);

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
