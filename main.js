function initGrid(scene) {
  for (let y = 0; y < gridSize; y++) {
    tiles[y] = [];
    tileText[y] = [];
    for (let x = 0; x < gridSize; x++) {
      const posX = x * (tileSize + padding) + tileSize / 2 + 20;
      const posY = y * (tileSize + padding) + tileSize / 2 + 20;

      let rect = scene.add.rectangle(posX, posY, tileSize, tileSize, 0xe0e0e0);
      let text = scene.add.text(posX, posY, '', {
        fontSize: '20px',
        color: '#333'
      }).setOrigin(0.5);

      tiles[y][x] = { value: 0, rect };
      tileText[y][x] = text;
    }
  }
}

function getColor(value) {
  const colors = {
    0: 0xe0e0e0, 1: 0xffccbc, 2: 0xffab91, 3: 0xff8a65, 4: 0xff7043, 5: 0xf4511e,
    6: 0xe64a19, 7: 0xd84315, 8: 0xbf360c
  };
  return colors[value] || 0x000000;
}

function updateTileDisplay(x, y) {
  const tile = tiles[y][x];
  const value = tile.value;
  tile.rect.setFillStyle(getColor(value));
  tileText[y][x].setText(value ? Math.pow(2, value) : '');
}

function updateScore() {
  document.getElementById("score").textContent = score;
  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem("bestScore", bestScore);
  }
  document.getElementById("best").textContent = bestScore;
}

function addRandomTile() {
  let empty = [];
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      if (tiles[y][x].value === 0) empty.push({ x, y });
    }
  }

  if (empty.length === 0) return checkGameOver();

  let { x, y } = Phaser.Utils.Array.GetRandom(empty);
  tiles[y][x].value = 1;
  updateTileDisplay(x, y);
}

function handleInput(event) {
  const k = event.code;
  if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(k)) {
    if (k === 'ArrowLeft') shiftLeft();
    if (k === 'ArrowRight') shiftRight();
    if (k === 'ArrowUp') shiftUp();
    if (k === 'ArrowDown') shiftDown();
    addRandomTile();
  }
}

function handleSwipe(dx, dy) {
  const absX = Math.abs(dx), absY = Math.abs(dy);
  if (Math.max(absX, absY) < 30) return;

  if (absX > absY) dx > 0 ? shiftRight() : shiftLeft();
  else dy > 0 ? shiftDown() : shiftUp();

  addRandomTile();
}

function shiftLeft() {
  for (let y = 0; y < gridSize; y++) {
    let row = tiles[y].map(t => t.value).filter(v => v);
    for (let i = 0; i < row.length - 1; i++) {
      if (row[i] === row[i + 1]) {
        row[i]++;
        score += Math.pow(2, row[i]);
        row[i + 1] = 0;
        mergeSound.play();
      }
    }
    row = row.filter(v => v);
    while (row.length < gridSize) row.push(0);

    for (let x = 0; x < gridSize; x++) {
      tiles[y][x].value = row[x];
      updateTileDisplay(x, y);
    }
  }
  updateScore();
}

function shiftRight() {
  reverseRows(); shiftLeft(); reverseRows();
}

function shiftUp() {
  transpose(); shiftLeft(); transpose();
}

function shiftDown() {
  transpose(); shiftRight(); transpose();
}

function reverseRows() {
  for (let y = 0; y < gridSize; y++) {
    tiles[y].reverse();
    tileText[y].reverse();
  }
}

function transpose() {
  [tiles, tileText] = [transposeGrid(tiles), transposeGrid(tileText)];
}

function transposeGrid(matrix) {
  return matrix[0].map((_, i) => matrix.map(row => row[i]));
}

function checkGameOver() {
  gameover.play();
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      let v = tiles[y][x].value;
      if (v === 0) return;
      if (x < gridSize - 1 && v === tiles[y][x + 1].value) return;
      if (y < gridSize - 1 && v === tiles[y + 1][x].value) return;
    }
  }

  // Show custom Game Over overlay
  setTimeout(() => {
    gameover.play();
    document.getElementById('final-score').textContent = score;
    document.getElementById('game-over').style.display = 'flex';
  }, 300);
}
function restartGame() {
  document.getElementById('game-over').style.display = 'none';
  sceneRef.scene.restart();
}