let gridSize = 4;
let tileSize = 90;
let padding = 10;
let tiles = [];
let sceneRef;
let score = 0;
let bestScore = 0;
let tileText = [];
let mergeSound;
let gameover;

let startX = 0, startY = 0;

function preload() {
  this.load.audio('merge', 'assets/sound/merge.wav');
  this.load.audio('gameover', 'assets/sound/gameover.wav');
}

function create() {
  sceneRef = this;
  score = 0;
  bestScore = parseInt(localStorage.getItem("bestScore")) || 0;
  updateScore();

  mergeSound = this.sound.add('merge');
  gameover = this.sound.add('gameover')

  this.input.keyboard.on('keydown', handleInput, this);
  this.input.on('pointerdown', e => { startX = e.x; startY = e.y; });
  this.input.on('pointerup', e => handleSwipe(e.x - startX, e.y - startY));

  document.getElementById('restart-btn').onclick = () => this.scene.restart();

  initGrid(this);
  addRandomTile();
  addRandomTile();
}

function update() {}

const config = {
  type: Phaser.AUTO,
  width: window.innerWidth < 420 ? 360 : 400,
  height: window.innerHeight < 500 ? 400 : 450,
  backgroundColor: '#ffffff',
  parent: 'game-container',
  scene: { preload, create, update }
};

window.addEventListener('load', () => {
  new Phaser.Game(config);
});
