// tutorial: https://lodev.org/cgtutor/raycasting.html

const GRID_ROWS = 10, GRID_COLS = 10;
const COLORS = {
  GRID_BACKGROUND: '#181818',
  GRID_LINES: '#333333',
  RED: '#FF0000',
  GREEN: '#00FF00',
  BLUE: '#0000FF',
  YELLOW: '#FFFF00',
  CYAN: '#00FFFF',
  MAGENTA: '#FF00FF',
};

class Vector2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  divideBy(value) {
    return new Vector2(this.x / value.x, this.y / value.y);
  }
  multiplyBy(value) {
    return new Vector2(this.x * value.x, this.y * value.y);
  }
  subtract(value) {
    return new Vector2(this.x - value.x, this.y - value.y);
  }
  addition(value) {
    return new Vector2(this.x + value.x, this.y + value.y);
  }
  normalize() {
    const length = this.length();
    length === 0 ? new Vector2(0, 0) : length;
    return new Vector2(this.x / length, this.y / length);
  }
  scale(value) {
    return new Vector2(this.x * value, this.y * value);
  }
}

function getCanvasSizeAsVector2(ctx) {
  return new Vector2(ctx.canvas.width, ctx.canvas.height);
}

function createLine(ctx, point01, point02) {
  ctx.beginPath();
  ctx.moveTo(point01.x, point01.y);
  ctx.lineTo(point02.x, point02.y);
  ctx.stroke();
}

function createCircle(ctx, center, radius) {
  ctx.beginPath();
  ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
  ctx.fill();
}

function renderGrid(ctx, point02) {
  ctx.reset();
  ctx.fillStyle = COLORS.GRID_BACKGROUND;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  ctx.scale(ctx.canvas.width / GRID_COLS, ctx.canvas.height / GRID_ROWS);
  ctx.lineWidth = 0.02;

  ctx.strokeStyle = COLORS.GRID_LINES;
  for (let x = 0; x <= GRID_COLS; x++) {
    createLine(ctx, new Vector2(x, 0), new Vector2(x, GRID_ROWS));
  }

  for (let y = 0; y <= GRID_ROWS; y++) {
    createLine(ctx, new Vector2(0, y), new Vector2(GRID_COLS, y));
  }

  const point01 = new Vector2(GRID_COLS * 0.34, GRID_ROWS * 0.34);
  ctx.fillStyle = COLORS.MAGENTA;
  createCircle(ctx, point01, 0.2);
  if (point02 !== null) {
    createCircle(ctx, point02, 0.2);
    ctx.strokeStyle = COLORS.MAGENTA;
    createLine(ctx, point01, point02);

    const nextPoint = rayCastStep(point01, point02);
    ctx.fillStyle = COLORS.GREEN;
    createCircle(ctx, nextPoint, 0.2);
    createLine(ctx, point02, nextPoint);
  }
}

function rayCastStep(point01, point02) {
  const nextPoint = point02.subtract(point01).normalize().addition(point02);
  return nextPoint;
}

const game = document.getElementById('game');
if (game === null) {
  throw new Error("Canvas 'game' not found");
}

game.width = 800;
game.height = 800;

const ctx = game.getContext('2d');
if (ctx === null) {
  throw new Error('Canvas 2d context not supported');
}

let point02 = null;
game.addEventListener("mousemove", (event) => {
  point02 = new Vector2(event.offsetX, event.offsetY).divideBy(getCanvasSizeAsVector2(ctx)).multiplyBy(new Vector2(GRID_COLS, GRID_ROWS));
  renderGrid(ctx, point02);
});

renderGrid(ctx, point02);

