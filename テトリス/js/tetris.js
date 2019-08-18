/**
 * 定数
 */
// ブロックの1辺のサイズ[px]
const BLOCK_SIZE = 20;
// ブロック数
const COL_BLOCK_NUM = 10;
const ROW_BLOCK_NUM = 20;
// 1フレームの時間間隔[ms]
const DELAY = 700;
// const DELAY = 200;

// パーツの名称とパーツのパターンごとの、初期位置の許容範囲。
// COL_BLOCK_NUMからの相対位置として指定。
const PARTS = [
	{name: "O-shaped", color:"#ffd600", initColMin: 0, initColMax: 1},
	{name: "L-shaped", color:"#ff6d00", initColMin: 1, initColMax: 1},
	{name: "J-shaped", color:"#304ff2", initColMin: 1, initColMax: 1},
	{name: "T-shaped", color:"#0091ea", initColMin: 1, initColMax: 1},
	{name: "S-shaped", color:"#c51162", initColMin: 1, initColMax: 1},
	{name: "Z-shaped", color:"#64dd17", initColMin: 1, initColMax: 1},
	{name: "I-shaped", color:"#d50000", initColMin: 1, initColMax: 2}
];
// 回転角の名称
const ROTATION = [0, 90, 180, 270];

/**
 * グローバル変数
 */
let interval;
// 盤面上の各セルにブロックがあるかを保持する
let blocks = [];
// 落下中のパーツ
let fallingParts;

/**
 * 初期化
 */
function init() {
	"use strict";
	drawBoard();

	// 盤面上のブロックを初期化する。
	// 各セルにブロックがあるかどうかは、背景色が透明かそうでないかで判断する。
	blocks = Array.from(new Array(ROW_BLOCK_NUM), () => new Array(COL_BLOCK_NUM).fill("transparent"));

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
	const pattern = Math.floor(Math.random() * PARTS.length);
	// 初期の行番号は固定。
	const initRow = -1;
	// パーツの基準セルの初期位置をランダムに決定する。
	const initCol = Math.floor(Math.random() * (COL_BLOCK_NUM - PARTS[pattern].initColMax - PARTS[pattern].initColMin) + PARTS[pattern].initColMin);
	return {
			pattern: pattern,
			angle: 0,
			row: initRow,
			col: initCol,
			color: PARTS[pattern].color
		};
}

/**
 * 新しいブロックを生成し、配列を返す。
 * パーツの回転も新規作成とみなす。
 * @returns {Object} 新しいブロック
 */
function createNewParts(def) {
	// パーツのセル位置を定義する。
	// 配列の順番は、定数PARTSとROTATIONに準ずる。
	const position = [
		// "O-shaped":
		// 0度
		[
			{row: def.row,     col: def.col},
			{row: def.row,     col: def.col + 1},
			{row: def.row + 1, col: def.col},
			{row: def.row + 1, col: def.col + 1}
		],
		[
			{row: def.row,     col: def.col},
			{row: def.row,     col: def.col + 1},
			{row: def.row + 1, col: def.col},
			{row: def.row + 1, col: def.col + 1}
		],
		[
			{row: def.row,     col: def.col},
			{row: def.row,     col: def.col + 1},
			{row: def.row + 1, col: def.col},
			{row: def.row + 1, col: def.col + 1}
		],
		[
			{row: def.row,     col: def.col},
			{row: def.row,     col: def.col + 1},
			{row: def.row + 1, col: def.col},
			{row: def.row + 1, col: def.col + 1}
		],
		// "L-shaped":
		[
			{row: def.row,     col: def.col},
			{row: def.row,     col: def.col - 1},
			{row: def.row,     col: def.col + 1},
			{row: def.row + 1, col: def.col - 1}
		],
		[
			{row: def.row,     col: def.col},
			{row: def.row - 1, col: def.col - 1},
			{row: def.row - 1, col: def.col},
			{row: def.row + 1, col: def.col}
		],
		[
			{row: def.row,     col: def.col},
			{row: def.row,     col: def.col - 1},
			{row: def.row,     col: def.col + 1},
			{row: def.row - 1, col: def.col + 1}
		],
		[
			{row: def.row,     col: def.col},
			{row: def.row - 1, col: def.col},
			{row: def.row + 1, col: def.col},
			{row: def.row + 1, col: def.col + 1}
		],
		// "J-shaped":
		[
			{row: def.row,     col: def.col},
			{row: def.row,     col: def.col - 1},
			{row: def.row,     col: def.col + 1},
			{row: def.row + 1, col: def.col + 1}
		],
		[
			{row: def.row,     col: def.col},
			{row: def.row - 1, col: def.col},
			{row: def.row + 1, col: def.col - 1},
			{row: def.row + 1, col: def.col}
		],
		[
			{row: def.row,     col: def.col},
			{row: def.row - 1, col: def.col - 1},
			{row: def.row,     col: def.col - 1},
			{row: def.row,     col: def.col + 1}
		],
		[
			{row: def.row,     col: def.col},
			{row: def.row - 1, col: def.col},
			{row: def.row - 1, col: def.col + 1},
			{row: def.row + 1, col: def.col}
		],
		// "T-shaped":
		[
			{row: def.row,     col: def.col},
			{row: def.row,     col: def.col - 1},
			{row: def.row,     col: def.col + 1},
			{row: def.row + 1, col: def.col}
		],
		[
			{row: def.row,     col: def.col},
			{row: def.row - 1, col: def.col},
			{row: def.row,     col: def.col - 1},
			{row: def.row + 1, col: def.col}
		],
		[
			{row: def.row,     col: def.col},
			{row: def.row - 1, col: def.col},
			{row: def.row,     col: def.col - 1},
			{row: def.row,     col: def.col + 1}
		],
		[
			{row: def.row,     col: def.col},
			{row: def.row - 1, col: def.col},
			{row: def.row,     col: def.col + 1},
			{row: def.row + 1, col: def.col}
		],
		// "S-shaped":
		[
			{row: def.row,     col: def.col},
			{row: def.row,     col: def.col + 1},
			{row: def.row + 1, col: def.col - 1},
			{row: def.row + 1, col: def.col}
		],
		[
			{row: def.row,     col: def.col},
			{row: def.row - 1, col: def.col - 1},
			{row: def.row,     col: def.col - 1},
			{row: def.row + 1, col: def.col}
		],
		[
			{row: def.row,     col: def.col},
			{row: def.row,     col: def.col + 1},
			{row: def.row + 1, col: def.col - 1},
			{row: def.row + 1, col: def.col}
		],
		[
			{row: def.row,     col: def.col},
			{row: def.row - 1, col: def.col - 1},
			{row: def.row,     col: def.col - 1},
			{row: def.row + 1, col: def.col}
		],
		// "Z-shaped":
		[
			{row: def.row,     col: def.col},
			{row: def.row,     col: def.col - 1},
			{row: def.row + 1, col: def.col},
			{row: def.row + 1, col: def.col + 1}
		],
		[
			{row: def.row,     col: def.col},
			{row: def.row - 1, col: def.col},
			{row: def.row,     col: def.col - 1},
			{row: def.row + 1, col: def.col - 1}
		],
		[
			{row: def.row,     col: def.col},
			{row: def.row,     col: def.col - 1},
			{row: def.row + 1, col: def.col},
			{row: def.row + 1, col: def.col + 1}
		],
		[
			{row: def.row,     col: def.col},
			{row: def.row - 1, col: def.col},
			{row: def.row,     col: def.col - 1},
			{row: def.row + 1, col: def.col - 1}
		],
		// "I-shaped":
		[
			{row: def.row, col: def.col},
			{row: def.row, col: def.col - 1},
			{row: def.row, col: def.col + 1},
			{row: def.row, col: def.col + 2}
		],
		[
			{row: def.row, col: def.col},
			{row: def.row - 1, col: def.col},
			{row: def.row + 1, col: def.col},
			{row: def.row + 2, col: def.col}
		],
		[
			{row: def.row, col: def.col},
			{row: def.row, col: def.col - 1},
			{row: def.row, col: def.col + 1},
			{row: def.row, col: def.col + 2}
		],
		[
			{row: def.row, col: def.col},
			{row: def.row - 1, col: def.col},
			{row: def.row + 1, col: def.col},
			{row: def.row + 2, col: def.col}
		]
	];
	console.log(PARTS[def.pattern].name + " " + def.angle + " " + position[def.pattern * ROTATION.length + def.angle]);
	return {
		pattern:  def.pattern,
		angle:    def.angle,
		position: position[def.pattern * ROTATION.length + def.angle],
		color:    def.color
	};
}

/**
 * ブロックのあるセルの背景色をセット。
 */
function paintBGColor() {
	// 落下済みのブロックを描画。
	// blocks配列には背景色を保持している。
	blocks.forEach((row, i) => {
		row.forEach((cell,j) => {
			board.children[i].children[j].style.backgroundColor = cell;
		});
	});
	// 落下中のブロックを描画。
	if (fallingParts) {
		fallingParts.position.forEach(p => {
			board.children[p.row].children[p.col].style.backgroundColor = fallingParts.color;
		})
	}
}

/**
 * ブロックを移動
 * @param {String} dir 移動する方向
 */
function moveBlock(dir) {
	switch (dir) {
		case "down":
			// 1行落下。
			fallingParts.position.forEach(p => p.row++);
			break;
		case "right":
			// 右に移動可能な領域を制限する。
			if (fallingParts.position.some(p => (p.col === COL_BLOCK_NUM - 1))) {
				return;
			}
			if (fallingParts.position.some(p => blocks[p.row][p.col + 1] !== "transparent")) {
				return;
			}
			// 1列右に移動。
			fallingParts.position.forEach(p => p.col++);
			break;
		case "left":
			// 左に移動可能な領域を制限する。
			if (fallingParts.position.some(p => p.col === 0)) {
				return;
			}
			if (fallingParts.position.some(p => blocks[p.row][p.col - 1] !== "transparent")) {
				return;
			}
			// 1列左に移動。
			fallingParts.position.forEach(p => p.col--);
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
	if (fallingParts.position.some(p => p.row === ROW_BLOCK_NUM - 1)) {
		return true;
	}
	if (fallingParts.position.some(p => blocks[p.row + 1][p.col] !== "transparent")) {
		return true;
	}
	return false;
}

/**
 * パーツが回転可能かどうかを判定する。
 * 引数として与えられた回転後のパーツが、他のブロック・壁と干渉しない場合回転可とする。
 */
function isRotable(parts) {
	if (parts.position.some(p =>
		// 盤面に存在する行からはみ出た場合。
		p.row < 0 || ROW_BLOCK_NUM - 1 < p.row
		// 盤面に存在する列からはみ出た場合。
				|| p.col < 0 || COL_BLOCK_NUM - 1 < p.col
		// いずれかのセルがすでに他のブロックで埋まっていた場合。
				|| blocks[p.row][p.col] !== "transparent")) {
		return false;
	}
	return true;
}

/*
 * ブロックが整列した行を消去する。
 */
function deleteRow() {
	blocks.forEach((row, i, blocks) => {
		// 1行すべてブロックで埋まっていたら。
		if (row.every(cell => cell !== "transparent")) {
			for (let j = i; j >= 0; j--) {
				// すぐ上の行のブロック情報を下にずらす。
				if (j === 0) {
					blocks[j].fill("transparent");
					continue;
				}
				blocks[j] = blocks[j - 1];
			}
		}
	});
}

/**
 *
 */
function draw() {
	const board = document.getElementById("board");
	// 盤面をクリア。
	clearBoard();

	// 落下完了判定。
	// 一番下まで落ちてからブロックを固定するまでに移動できるように、
	// 落下後の次のintervalでこの判定を行う。
	if (fallingParts && hasFallen()) {
		// 「落下中」から「落下済み」に移す。
		fallingParts.position.forEach(p => blocks[p.row][p.col] = fallingParts.color);
		fallingParts = null;
	}

	// ブロックが整列した行を消す。
	deleteRow();

	// ブロックが落下し終わったら新しいブロックを生成。
	if (!fallingParts) {
		fallingParts = createNewParts(selectNewParts());
	}

	// 落下。
	moveBlock("down");

	// 背景色を塗る。
	paintBGColor();

}

document.addEventListener("keydown", e => {
	// 落下中のブロックがない場合は処理をスキップする。
	if (!fallingParts) {
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
		// 落下完了判定。
		if (hasFallen()) {
			// 「落下中」から「落下済み」に移す。
			fallingParts.position.forEach(p => blocks[p.row][p.col] = fallingParts.color);
			fallingParts = null;
		// まだ落下できる領域があれば下に移動する。
		} else {
			moveBlock("down");
		}
	// ハードドロップ
	} else if (e.key === " ") {
		console.log("space");
	// "c"キー押下で右回転
	} else if (e.key === "c") {
		// 回転後のパーツ情報を取得する。
		const newParts = createNewParts({
			pattern: fallingParts.pattern,
			angle:   (fallingParts.angle + 1) % ROTATION.length,
			row:     fallingParts.position[0].row,
			col:     fallingParts.position[0].col,
			color:   fallingParts.color
		});
		// 回転可能かを判定し、回転可なら落下中のパーツと入れ替える。
		if (isRotable(newParts)) {
			fallingParts = newParts;
		}
	// "z"キー押下で左回転
	} else if (e.key === "z") {
		const newParts = createNewParts({
			pattern: fallingParts.pattern,
			angle:   (fallingParts.angle + ROTATION.length - 1) % ROTATION.length,
			row:     fallingParts.position[0].row,
			col:     fallingParts.position[0].col,
			color:   fallingParts.color
		});
		// 回転可能かを判定し、回転可なら落下中のパーツと入れ替える。
		if (isRotable(newParts)) {
			fallingParts = newParts;
		}
	} else if (e.key === "x") {

	}
	// 背景色を塗る。
	paintBGColor();
}, false);

