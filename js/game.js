/* ═══════════════════════════════════════════════════════════════
   TypeFlow — Falling Words Game
   ═══════════════════════════════════════════════════════════════ */

let game = {
  active: false,
  score: 0,
  wordsCompleted: 0,
  lives: 3,
  words: [],
  interval: null,
  animFrame: null,
  speed: 0.5,
  spawnRate: 2500,
  currentTarget: null
};

function initGame() {
  document.getElementById('game-score').textContent = '0';
  document.getElementById('game-words').textContent = '0';
  document.getElementById('game-lives').textContent = '♥♥♥';
  document.getElementById('game-start-msg').classList.remove('hidden');
  document.getElementById('game-input').value = '';
  document.getElementById('game-btn').textContent = 'Iniciar';
  clearGameArea();
}

function startGame() {
  if (game.active) { stopGame(); initGame(); return; }

  game = {
    active: true, score: 0, wordsCompleted: 0, lives: 3,
    words: [], interval: null, animFrame: null,
    speed: 0.5, spawnRate: 2500, currentTarget: null
  };
  document.getElementById('game-start-msg').classList.add('hidden');
  document.getElementById('game-btn').textContent = 'Parar';
  document.getElementById('game-input').focus();

  spawnWord();
  game.interval = setInterval(spawnWord, game.spawnRate);
  gameLoop();
}

function stopGame() {
  game.active = false;
  if (game.interval) clearInterval(game.interval);
  if (game.animFrame) cancelAnimationFrame(game.animFrame);
  game.interval = null;
  game.animFrame = null;
}

function clearGameArea() {
  const area = document.getElementById('game-area');
  area.querySelectorAll('.falling-word').forEach(w => w.remove());
}

function spawnWord() {
  if (!game.active) return;
  const area = document.getElementById('game-area');
  const word = GAME_WORDS[Math.floor(Math.random() * GAME_WORDS.length)];
  const el = document.createElement('div');
  el.className = 'falling-word';
  el.textContent = word;
  el.dataset.word = word;
  const maxX = area.clientWidth - 120;
  el.style.left = (Math.random() * maxX + 10) + 'px';
  el.style.top = '-30px';
  area.appendChild(el);
  game.words.push({ el, word, y: -30 });
}

function gameLoop() {
  if (!game.active) return;
  const area = document.getElementById('game-area');
  const areaH = area.clientHeight;

  // Iterate backwards to safely splice
  for (let i = game.words.length - 1; i >= 0; i--) {
    const w = game.words[i];
    w.y += game.speed;
    w.el.style.top = w.y + 'px';

    if (w.y > areaH) {
      w.el.remove();
      game.words.splice(i, 1);
      game.lives--;
      updateGameUI();
      if (game.lives <= 0) { endGame(); return; }
    }
  }

  game.animFrame = requestAnimationFrame(gameLoop);
}

function handleGameInput() {
  if (!game.active) return;
  const input = document.getElementById('game-input');
  const val = input.value.toLowerCase().trim();

  // Find target word
  if (!game.currentTarget || !game.currentTarget.word.startsWith(val)) {
    // Clear old target
    if (game.currentTarget) {
      game.currentTarget.el.classList.remove('target');
    }
    game.currentTarget = game.words.find(w => w.word.startsWith(val)) || null;
  }

  if (game.currentTarget) {
    game.currentTarget.el.classList.add('target');

    // Update display with typed chars highlighted
    const word = game.currentTarget.word;
    let html = '';
    for (let i = 0; i < word.length; i++) {
      if (i < val.length && val[i] === word[i]) html += `<span class="typed">${word[i]}</span>`;
      else html += word[i];
    }
    game.currentTarget.el.innerHTML = html;

    // Check completion
    if (val === game.currentTarget.word) {
      game.currentTarget.el.remove();
      const idx = game.words.indexOf(game.currentTarget);
      if (idx > -1) game.words.splice(idx, 1);
      game.score += game.currentTarget.word.length * 10;
      game.wordsCompleted++;
      game.currentTarget = null;
      input.value = '';

      // Speed up every 5 words
      if (game.wordsCompleted % 5 === 0) {
        game.speed += 0.1;
        if (game.spawnRate > 1000) {
          game.spawnRate -= 200;
          clearInterval(game.interval);
          game.interval = setInterval(spawnWord, game.spawnRate);
        }
      }

      updateGameUI();
      playKeySound(true);
    }
  }
}

function updateGameUI() {
  document.getElementById('game-score').textContent = game.score;
  document.getElementById('game-words').textContent = game.wordsCompleted;
  document.getElementById('game-lives').textContent =
    '♥'.repeat(Math.max(0, game.lives)) + '♡'.repeat(Math.max(0, 3 - game.lives));
}

function endGame() {
  stopGame();
  clearGameArea();
  document.getElementById('game-start-msg').textContent =
    `Fim! ${game.score} pontos — ${game.wordsCompleted} palavras`;
  document.getElementById('game-start-msg').classList.remove('hidden');
  document.getElementById('game-btn').textContent = 'Jogar de novo';

  const xp = Math.round(game.score / 10);
  if (xp > 0) {
    const leveledUp = addXP(xp);
    updateHeaderUI();
    if (leveledUp) showLevelUp(state.level);
    showToast(`+${xp} XP pelo jogo!`);
  }
}
