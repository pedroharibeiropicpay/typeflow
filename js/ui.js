/* ═══════════════════════════════════════════════════════════════
   TypeFlow — UI (navegação, dashboard, lessons, results, charts, settings)
   ═══════════════════════════════════════════════════════════════ */

let audioCtx = null;

// ─── NAVIGATION ──────────────────────────────────────────────
function navigate(page) {
  document.querySelectorAll('main > section').forEach(s => s.classList.add('hidden'));
  const target = document.getElementById('page-' + page);
  if (target) {
    target.classList.remove('hidden');
    target.classList.add('fade-in');
  }
  document.querySelectorAll('.nav-link[data-page]').forEach(n => {
    n.classList.toggle('active', n.dataset.page === page);
  });

  if (page !== 'exercise') stopExerciseTimer();
  if (page !== 'game') stopGame();

  if (page === 'dashboard') renderDashboard();
  if (page === 'lessons') renderLessons();
  if (page === 'stats') renderStats();
  if (page === 'game') initGame();
}

// ─── HEADER ──────────────────────────────────────────────────
function updateHeaderUI() {
  document.getElementById('user-level-text').textContent = `Nv ${state.level}`;
  const needed = xpForLevel(state.level);
  const pct = Math.min(100, (state.xp / needed) * 100);
  document.getElementById('xp-fill').style.width = pct + '%';
  document.getElementById('user-xp-text').textContent = `${state.xp} XP`;
}

function showLevelUp(lvl) {
  const overlay = document.createElement('div');
  overlay.className = 'level-up-overlay';
  overlay.innerHTML = `
    <div class="level-up-card">
      <h2>Level Up!</h2>
      <div class="new-level">Nível ${lvl}</div>
      <p style="color:var(--text-secondary)">Continue praticando!</p>
      <button class="btn btn-primary" style="margin-top:20px" onclick="this.closest('.level-up-overlay').remove()">Valeu!</button>
    </div>
  `;
  document.body.appendChild(overlay);
  setTimeout(() => { if (overlay.parentNode) overlay.remove(); }, 5000);
}

// ─── DASHBOARD ───────────────────────────────────────────────
function renderDashboard() {
  const sessions = state.sessions;
  const avgWpm = sessions.length ? Math.round(sessions.reduce((a,s) => a + s.wpm, 0) / sessions.length) : 0;
  const avgAcc = sessions.length ? Math.round(sessions.reduce((a,s) => a + s.accuracy, 0) / sessions.length) : 0;
  const completedCount = Object.values(state.progress).filter(p => p.completed).length;
  const totalMin = Math.round(state.totalTime / 60);

  document.getElementById('dash-wpm').innerHTML = `${avgWpm} <span class="stat-unit">WPM</span>`;
  document.getElementById('dash-accuracy').innerHTML = `${avgAcc}<span class="stat-unit">%</span>`;
  document.getElementById('dash-lessons').innerHTML = `${completedCount}<span class="stat-unit">/${LESSONS.length}</span>`;
  document.getElementById('dash-time').innerHTML = `${totalMin}<span class="stat-unit">min</span>`;

  renderChart('chart-wpm', sessions.slice(-20));
}

// ─── CHART ───────────────────────────────────────────────────
function renderChart(canvasId, sessions) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || !sessions.length) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);
  const w = rect.width, h = rect.height;
  ctx.clearRect(0, 0, w, h);

  const values = sessions.map(s => s.wpm);
  const max = Math.max(...values, 30);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const padX = 40, padY = 20;
  const plotW = w - padX * 2, plotH = h - padY * 2;

  // Grid
  ctx.strokeStyle = 'rgba(255,255,255,0.05)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = padY + (plotH / 4) * i;
    ctx.beginPath(); ctx.moveTo(padX, y); ctx.lineTo(w - padX, y); ctx.stroke();
    ctx.fillStyle = '#64748b';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(Math.round(max - (range / 4) * i), padX - 8, y + 4);
  }

  // Line
  const gradient = ctx.createLinearGradient(0, padY, 0, h - padY);
  gradient.addColorStop(0, '#6c63ff');
  gradient.addColorStop(1, '#00d2ff');
  ctx.strokeStyle = gradient;
  ctx.lineWidth = 2.5;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.beginPath();
  values.forEach((v, i) => {
    const x = padX + (plotW / Math.max(values.length - 1, 1)) * i;
    const y = padY + plotH - ((v - min) / range) * plotH;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  });
  ctx.stroke();

  // Area fill
  const areaGrad = ctx.createLinearGradient(0, padY, 0, h - padY);
  areaGrad.addColorStop(0, 'rgba(108, 99, 255, 0.15)');
  areaGrad.addColorStop(1, 'rgba(108, 99, 255, 0)');
  ctx.lineTo(padX + plotW, padY + plotH);
  ctx.lineTo(padX, padY + plotH);
  ctx.closePath();
  ctx.fillStyle = areaGrad;
  ctx.fill();

  // Dots
  values.forEach((v, i) => {
    const x = padX + (plotW / Math.max(values.length - 1, 1)) * i;
    const y = padY + plotH - ((v - min) / range) * plotH;
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#6c63ff';
    ctx.fill();
    ctx.strokeStyle = '#1a1a2e';
    ctx.lineWidth = 2;
    ctx.stroke();
  });
}

// ─── LESSONS LIST ────────────────────────────────────────────
function renderLessons() {
  const grid = document.getElementById('lessons-grid');
  grid.innerHTML = '';
  LESSONS.forEach(lesson => {
    const progress = state.progress[lesson.id] || {};
    const unlocked = isLessonUnlocked(lesson.id);
    const completed = progress.completed;
    const pct = completed ? 100 : progress.exerciseIndex ? (progress.exerciseIndex / lesson.exercises.length) * 100 : 0;

    let badgeHtml = '';
    if (completed) badgeHtml = '<span class="lesson-badge badge-done">completo</span>';
    else if (!unlocked) badgeHtml = '<span class="lesson-badge badge-locked">bloqueado</span>';
    else if (!progress.attempts) badgeHtml = '<span class="lesson-badge badge-new">novo</span>';

    const card = document.createElement('div');
    card.className = `lesson-card ${completed ? 'completed' : ''} ${!unlocked ? 'locked' : ''}`;
    card.innerHTML = `
      <div class="lesson-number">Capítulo ${lesson.chapter} — Lição ${lesson.id}</div>
      <div class="lesson-title">${lesson.title}</div>
      <div class="lesson-keys">${lesson.keys}</div>
      <div class="lesson-desc">${lesson.desc}</div>
      <div class="lesson-progress-bar"><div class="lesson-progress-fill" style="width:${pct}%"></div></div>
      <div class="lesson-meta">
        <span>${progress.bestWpm ? progress.bestWpm + ' WPM' : ''}</span>
        ${badgeHtml}
      </div>
    `;
    if (unlocked) card.onclick = () => startLesson(lesson.id);
    grid.appendChild(card);
  });
}

function continueLesson() {
  for (const lesson of LESSONS) {
    if (!state.progress[lesson.id] || !state.progress[lesson.id].completed) {
      if (isLessonUnlocked(lesson.id)) {
        startLesson(lesson.id);
        return;
      }
    }
  }
  startLesson(LESSONS[LESSONS.length - 1].id);
}

// ─── EXERCISE ────────────────────────────────────────────────
function startLesson(lessonId, exIdx) {
  const lesson = LESSONS.find(l => l.id === lessonId);
  if (!lesson) return;

  const progress = state.progress[lessonId] || {};
  const exerciseIndex = exIdx !== undefined ? exIdx : (progress.exerciseIndex || 0);

  resetExercise(lesson.exercises[exerciseIndex], lessonId, exerciseIndex);

  document.getElementById('exercise-title').textContent =
    `Capítulo ${lesson.chapter} — ${lesson.title} (${exerciseIndex + 1}/${lesson.exercises.length})`;

  navigate('exercise');
  renderTextDisplay();
  renderKeyboard();
  updateLiveStatsUI();
  document.getElementById('start-prompt').classList.remove('hidden');
  document.getElementById('text-display').focus();
}

function renderTextDisplay() {
  const display = document.getElementById('text-display');
  display.innerHTML = exercise.text.split('').map((char, i) => {
    let cls = 'pending';
    if (i < exercise.currentIndex) cls = exercise.charResults[i] || 'correct';
    if (i === exercise.currentIndex) cls = 'current';
    return `<span class="char ${cls}" data-index="${i}">${char === ' ' ? '&nbsp;' : escapeHtml(char)}</span>`;
  }).join('');
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function updateCharDisplay(index, className) {
  const el = document.querySelector(`.char[data-index="${index}"]`);
  if (el) el.className = `char ${className}`;
}

function handleKeyPress(e) {
  if (document.getElementById('page-exercise').classList.contains('hidden')) return;
  if (e.key === 'Escape') { navigate('lessons'); return; }
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  if (e.key.length > 1 && e.key !== 'Backspace') return;

  e.preventDefault();

  // Start timer on first key
  if (!exercise.startTime) {
    startExerciseTimer(updateLiveStatsUI);
    document.getElementById('start-prompt').classList.add('hidden');
  }

  if (e.key === 'Backspace') {
    if (processBackspace()) {
      updateCharDisplay(exercise.currentIndex, 'current');
      if (exercise.currentIndex + 1 < exercise.text.length) {
        updateCharDisplay(exercise.currentIndex + 1, 'pending');
      }
      highlightKey(exercise.text[exercise.currentIndex].toLowerCase());
    }
    return;
  }

  const result = processKey(e.key);
  if (!result) return;

  playKeySound(result.correct);

  if (result.correct) {
    updateCharDisplay(exercise.currentIndex - 1, 'correct');
    flashKey(result.expected.toLowerCase(), 'pressed');
  } else {
    updateCharDisplay(exercise.currentIndex - 1, 'incorrect');
    flashKey(result.expected.toLowerCase(), 'wrong');
  }

  if (result.finished) {
    const results = finishExercise();
    updateHeaderUI();
    if (results.leveledUp) showLevelUp(state.level);
    showResultsScreen(results);
    return;
  }

  updateCharDisplay(exercise.currentIndex, 'current');
  highlightKey(exercise.text[exercise.currentIndex].toLowerCase());
  updateLiveStatsUI();
}

function updateLiveStatsUI() {
  const stats = getExerciseStats();
  const mins = Math.floor(stats.elapsed / 60);
  const secs = Math.floor(stats.elapsed % 60);

  document.getElementById('live-timer').textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
  document.getElementById('live-wpm').textContent = stats.wpm;
  document.getElementById('live-accuracy').textContent = stats.accuracy + '%';
  document.getElementById('live-streak').textContent = stats.streak;
}

function restartExercise() {
  startLesson(exercise.lessonId, exercise.exerciseIndex);
}

function goNextLesson() {
  const next = getNextExerciseInfo();
  if (next.type === 'allDone') {
    navigate('lessons');
  } else {
    startLesson(next.lessonId, next.exerciseIndex);
  }
}

// ─── RESULTS ─────────────────────────────────────────────────
function showResultsScreen(results) {
  const mins = Math.floor(results.elapsed / 60);
  const secs = Math.floor(results.elapsed % 60);

  let icon = '🏆', title = 'Excelente!', subtitle = 'Performance incrível!';
  if (results.accuracy < 80) { icon = '🎯'; title = 'Continue praticando'; subtitle = 'Foque na precisão antes da velocidade.'; }
  else if (results.accuracy < 90) { icon = '👍'; title = 'Bom trabalho!'; subtitle = 'Precisão melhorando, continue assim.'; }
  else if (results.wpm < 20) { icon = '🌱'; title = 'Crescendo!'; subtitle = 'A velocidade vem com a prática.'; }

  document.getElementById('results-icon').textContent = icon;
  document.getElementById('results-title').textContent = title;
  document.getElementById('results-subtitle').textContent = subtitle;
  document.getElementById('result-wpm').textContent = results.wpm;
  document.getElementById('result-accuracy').textContent = results.accuracy + '%';
  document.getElementById('result-time').textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
  document.getElementById('result-streak').textContent = results.maxStreak;
  document.getElementById('results-xp').textContent = `+${results.xpGain} XP`;

  // Problem keys
  const problemKeys = Object.entries(results.keyErrors).sort((a,b) => b[1] - a[1]).slice(0, 5);
  const pkSection = document.getElementById('problem-keys-section');
  const pkList = document.getElementById('problem-keys-list');
  if (problemKeys.length > 0) {
    pkSection.classList.remove('hidden');
    pkList.innerHTML = problemKeys.map(([k, count]) =>
      `<span class="problem-key-chip">${k === ' ' ? 'Espaço' : k.toUpperCase()} (${count}x)</span>`
    ).join('');
  } else {
    pkSection.classList.add('hidden');
  }

  // Next button
  const btnNext = document.getElementById('btn-next-lesson');
  const next = getNextExerciseInfo();
  if (next.type === 'nextLesson') {
    btnNext.textContent = 'Próxima Lição';
    btnNext.classList.remove('hidden');
  } else if (next.type === 'nextExercise') {
    btnNext.textContent = 'Próximo Exercício';
    btnNext.classList.remove('hidden');
  } else {
    btnNext.classList.add('hidden');
  }

  document.querySelectorAll('main > section').forEach(s => s.classList.add('hidden'));
  document.getElementById('page-results').classList.remove('hidden');
}

// ─── STATS PAGE ──────────────────────────────────────────────
function renderStats() {
  const sessions = state.sessions;
  const bestWpm = sessions.length ? Math.max(...sessions.map(s => s.wpm)) : 0;

  document.getElementById('stats-best-wpm').textContent = bestWpm;
  document.getElementById('stats-sessions').textContent = sessions.length;
  document.getElementById('stats-keystrokes').textContent = formatNumber(state.totalKeystrokes);
  document.getElementById('stats-best-streak').textContent = state.bestStreak;

  renderChart('chart-stats-wpm', sessions.slice(-30));
  renderHeatmap();
}

function renderHeatmap() {
  const heatmap = document.getElementById('heatmap');
  heatmap.innerHTML = '';
  const allKeys = 'abcdefghijklmnopqrstuvwxyz'.split('');
  const maxErrors = Math.max(...allKeys.map(k => state.keyErrors[k] || 0), 1);

  allKeys.forEach(k => {
    const errors = state.keyErrors[k] || 0;
    const intensity = errors / maxErrors;
    const r = Math.round(30 + intensity * 200);
    const g = Math.round(40 + (1 - intensity) * 120);
    const b = Math.round(60 + (1 - intensity) * 80);
    const el = document.createElement('div');
    el.className = 'heatmap-key';
    el.textContent = k.toUpperCase();
    el.style.background = `rgb(${r}, ${g}, ${b})`;
    el.style.color = intensity > 0.5 ? '#fff' : 'var(--text-secondary)';
    el.title = `${errors} erros`;
    heatmap.appendChild(el);
  });
}

function formatNumber(n) {
  if (n >= 1000000) return (n/1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n/1000).toFixed(1) + 'K';
  return n.toString();
}

// ─── SOUND ───────────────────────────────────────────────────
function playKeySound(correct) {
  if (!state.settings.sound) return;
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.frequency.value = correct ? 600 : 200;
  osc.type = correct ? 'sine' : 'square';
  gain.gain.value = 0.05;
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.1);
}

// ─── SETTINGS ────────────────────────────────────────────────
function openSettings() {
  document.getElementById('settings-modal').classList.remove('hidden');
  document.getElementById('setting-layout').value = state.settings.layout;
  document.getElementById('toggle-sound').classList.toggle('on', state.settings.sound);
  document.getElementById('toggle-keyboard').classList.toggle('on', state.settings.showKeyboard);
  document.getElementById('toggle-fingers').classList.toggle('on', state.settings.showFingers);
}

function closeSettings() {
  document.getElementById('settings-modal').classList.add('hidden');
}

function toggleSetting(el, key) {
  el.classList.toggle('on');
  state.settings[key] = el.classList.contains('on');
  saveSettings();
}

function saveSettings() {
  state.settings.layout = document.getElementById('setting-layout').value;
  saveState();
}

// ─── TOAST ───────────────────────────────────────────────────
function showToast(msg) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}
