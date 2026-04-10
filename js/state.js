/* ═══════════════════════════════════════════════════════════════
   TypeFlow — State Management (persistência, XP, níveis)
   ═══════════════════════════════════════════════════════════════ */

function createDefaultState() {
  return {
    settings: { layout: 'br', sound: false, showKeyboard: true, showFingers: true },
    progress: {},
    xp: 0,
    level: 1,
    totalKeystrokes: 0,
    totalTime: 0,
    bestStreak: 0,
    sessions: [],
    keyErrors: {}
  };
}

let state = createDefaultState();

function saveState() {
  localStorage.setItem('typeflow_state', JSON.stringify(state));
}

function loadState() {
  const saved = localStorage.getItem('typeflow_state');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      state = { ...createDefaultState(), ...parsed };
    } catch (e) {
      console.warn('TypeFlow: estado corrompido, resetando.', e);
      state = createDefaultState();
    }
  }
}

function resetAllProgress() {
  localStorage.removeItem('typeflow_state');
  state = createDefaultState();
  saveState();
}

function xpForLevel(lvl) {
  return lvl * 100;
}

function addXP(amount) {
  state.xp += amount;
  const needed = xpForLevel(state.level);
  let leveledUp = false;
  if (state.xp >= needed) {
    state.xp -= needed;
    state.level++;
    leveledUp = true;
  }
  saveState();
  return leveledUp;
}

function isLessonUnlocked(lessonId) {
  if (lessonId === 1) return true;
  const prev = state.progress[lessonId - 1];
  return !!(prev && prev.completed);
}

function getLessonProgress(lessonId) {
  return state.progress[lessonId] || null;
}

function ensureLessonProgress(lessonId) {
  if (!state.progress[lessonId]) {
    state.progress[lessonId] = {
      completed: false,
      bestWpm: 0,
      bestAccuracy: 0,
      attempts: 0,
      exerciseIndex: 0
    };
  }
  return state.progress[lessonId];
}

function calculateXPGain(wpm, accuracy, isFirstCompletion) {
  let xpGain = 20;
  if (accuracy >= 95) xpGain += 20;
  else if (accuracy >= 85) xpGain += 10;
  if (wpm >= 60) xpGain += 30;
  else if (wpm >= 40) xpGain += 15;
  else if (wpm >= 20) xpGain += 5;
  if (isFirstCompletion) xpGain += 25;
  return xpGain;
}
