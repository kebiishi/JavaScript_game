// スコア
let score = 0;

// Canvasパラメータ
let ctx;
let canvasWidth;
let canvasY;

// ballパラメータ
let ballX;
let ballY;
const ballRadius = 10;
let dx = 2;
let dy = -2;

// paddleパラメータ
let paddleX;
const paddleHeight = 10;
const paddleWidth = 75;
const paddleMoveLength = 7;

// blockパラメータ
let bricks;
const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

let rightPressed = false;
let leftPressed = false;

let interval = setInterval(draw, 10);

function init() {
	const canvas = document.getElementById("myCanvas");
	canvasWidth = canvas.width;
	canvasHeight = canvas.height;
	ctx = canvas.getContext("2d");
	ballX = canvasWidth / 2;
	ballY = canvasHeight - 30;
	ballX = canvasWidth / 2;
	paddleX = (canvasWidth - paddleWidth) / 2;
	bricks = [];
	for (let c = 0; c < brickColumnCount; c++) {
		bricks[c] = [];
		for (let r = 0; r < brickRowCount; r++) {
			bricks[c][r] = {
				x: 0,
				y: 0,
				status: true
			};
		}
	}
}

function draw() {
	// Canvasをクリアする
	ctx.clearRect(0, 0, canvasWidth, canvasHeight);

	// ボールを描画する
	drawBall();

	// パドルを描画する
	drawPaddle();

	// ブロックを描画する
	drawBricks();

	// スコアを表示する
	drawScore();

	// 壁に衝突したら反射する
	// 下の壁に衝突したらゲームオーバー。
	if (ballY + dy < ballRadius) {
		dy = -dy;
	}
	else if (ballY + dy > canvasHeight - ballRadius ) {
		if (ballX > paddleX && ballX < paddleX + paddleWidth) {
			dy = -dy;
		}
		else {
			alert("GAME OVER");
			document.location.reload();
			clearInterval(interval);
		}
	}
	if (ballX + dx < ballRadius || ballX + dx > canvasWidth - ballRadius) {
		dx = -dx;
	}

	// ブロックと衝突したら向きを変える
	collisionDetection();

	ballX += dx;
	ballY += dy;

	// 方向キーの入力によってパドルを左右に移動させる
	if (rightPressed && paddleX + paddleWidth < canvasWidth) {
		paddleX += paddleMoveLength;
	}
	else if (leftPressed && paddleX > 0) {
		paddleX -= paddleMoveLength;
	}

}

function drawBall() {
	ctx.beginPath();
	ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2, false);
	ctx.fillStyle = "#0095DD";
	ctx.fill();
	ctx.closePath();
}

function drawPaddle() {
	ctx.beginPath();
	ctx.rect(paddleX, canvasHeight - paddleHeight, paddleWidth, paddleHeight);
	ctx.fillStyle = "#0095DD";
	ctx.fill();
	ctx.closePath();
}

function drawBricks() {
	for (let c = 0; c < brickColumnCount; c++) {
		for (let r = 0; r < brickRowCount; r++) {
			// ボールが当たったブロックは描画しない
			if (!bricks[c][r].status) {
				continue;
			}

			const brickX = c*(brickWidth + brickPadding) + brickOffsetLeft;
			const brickY = r*(brickHeight + brickPadding) + brickOffsetTop;
			bricks[c][r].x = brickX;
			bricks[c][r].y = brickY;

			ctx.beginPath();
			ctx.rect(brickX, brickY, brickWidth, brickHeight);
			ctx.fillStyle = "#0095DD";
			ctx.fill();
			ctx.closePath();
		}
	}
}

// スコアを表示する
function drawScore() {
	ctx.font = "16px Arial";
	ctx.fillStyle = "#0095DD";
	ctx.fillText("Score: " + score, 8 ,20);
}

document.addEventListener("keydown", function(e) {
	if (e.key === "Right" || e.key === "ArrowRight") {
		rightPressed = true;
	}
	else if (e.key === "Left" || e.key === "ArrowLeft") {
		leftPressed = true;
	}
}, false);

document.addEventListener("keyup", function(e) {
	if (e.key === "Right" || e.key === "ArrowRight") {
		rightPressed = false;
	}
	else if (e.key === "Left" || e.key === "ArrowLeft") {
		leftPressed = false;
	}
}, false);

function collisionDetection() {
	for (let c = 0; c < brickColumnCount; c++) {
		for (let r = 0; r < brickRowCount; r++) {
			let b = bricks[c][r];
			// 一度ボールが当たったブロックは判定しない
			if (!b.status) {
				continue;
			}

			if (b.x <= ballX && ballX <= b.x + brickWidth
					&& b.y <= ballY && ballY <= b.y + brickHeight) {
				b.status = false;
				// 向きを変える
				dy = -dy;
				// スコアを加算する
				score += 10;
				if (score == brickRowCount * brickColumnCount * 10) {
					alert("YOU WIN. CONGRATULATIONS!");
					document.location.reload();
				}
			}
		}
	}
}

