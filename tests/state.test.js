/* ═══════════════════════════════════════════════════════════════
   TypeFlow — Tests: State management, XP, níveis, persistência
   ═══════════════════════════════════════════════════════════════ */

// Mock localStorage antes de carregar os scripts
const storage = {};
globalThis.localStorage = {
  getItem: (k) => storage[k] || null,
  setItem: (k, v) => { storage[k] = v; },
  removeItem: (k) => { delete storage[k]; }
};

const { loadAll } = require('./helper.js');
loadAll();

const { test, beforeEach } = require('node:test');
const assert = require('node:assert/strict');

function resetStorage() {
  Object.keys(storage).forEach(k => delete storage[k]);
  state = createDefaultState();
}

beforeEach(() => { resetStorage(); });

test('createDefaultState retorna estado limpo', () => {
  const s = createDefaultState();
  assert.equal(s.xp, 0);
  assert.equal(s.level, 1);
  assert.equal(s.totalKeystrokes, 0);
  assert.deepEqual(s.progress, {});
  assert.deepEqual(s.sessions, []);
  assert.deepEqual(s.keyErrors, {});
});

test('saveState e loadState preservam dados', () => {
  state.xp = 50;
  state.level = 3;
  state.progress[1] = { completed: true, bestWpm: 40, bestAccuracy: 95, attempts: 2, exerciseIndex: 0 };
  saveState();

  state = createDefaultState(); // reset in-memory
  loadState();

  assert.equal(state.xp, 50);
  assert.equal(state.level, 3);
  assert.equal(state.progress[1].completed, true);
  assert.equal(state.progress[1].bestWpm, 40);
});

test('loadState lida com JSON corrompido sem crashar', () => {
  storage['typeflow_state'] = 'invalid json!!!';
  state = createDefaultState();
  loadState();
  assert.equal(state.level, 1);
});

test('resetAllProgress limpa tudo', () => {
  state.xp = 100;
  state.level = 5;
  state.progress[1] = { completed: true };
  saveState();

  resetAllProgress();

  assert.equal(state.xp, 0);
  assert.equal(state.level, 1);
  assert.deepEqual(state.progress, {});
});

test('xpForLevel retorna valor correto', () => {
  assert.equal(xpForLevel(1), 100);
  assert.equal(xpForLevel(5), 500);
  assert.equal(xpForLevel(10), 1000);
});

test('addXP soma XP sem level up', () => {
  state.level = 1;
  state.xp = 0;
  const leveledUp = addXP(50);
  assert.equal(leveledUp, false);
  assert.equal(state.xp, 50);
  assert.equal(state.level, 1);
});

test('addXP faz level up quando XP suficiente', () => {
  state.level = 1;
  state.xp = 80;
  const leveledUp = addXP(30);
  assert.equal(leveledUp, true);
  assert.equal(state.level, 2);
  assert.equal(state.xp, 10);
});

test('isLessonUnlocked: lição 1 sempre desbloqueada', () => {
  assert.equal(isLessonUnlocked(1), true);
});

test('isLessonUnlocked: lição 2 bloqueada sem completar lição 1', () => {
  assert.equal(isLessonUnlocked(2), false);
});

test('isLessonUnlocked: lição 2 desbloqueada após completar lição 1', () => {
  state.progress[1] = { completed: true, bestWpm: 30, bestAccuracy: 90, attempts: 5, exerciseIndex: 0 };
  assert.equal(isLessonUnlocked(2), true);
});

test('ensureLessonProgress cria se não existe', () => {
  const prog = ensureLessonProgress(5);
  assert.equal(prog.completed, false);
  assert.equal(prog.bestWpm, 0);
  assert.equal(prog.attempts, 0);
  assert.equal(prog.exerciseIndex, 0);
  assert.ok(state.progress[5]);
});

test('ensureLessonProgress não sobrescreve existente', () => {
  state.progress[3] = { completed: true, bestWpm: 60, bestAccuracy: 98, attempts: 3, exerciseIndex: 0 };
  const prog = ensureLessonProgress(3);
  assert.equal(prog.completed, true);
  assert.equal(prog.bestWpm, 60);
});

test('calculateXPGain: base case', () => {
  assert.equal(calculateXPGain(10, 70, false), 20);
});

test('calculateXPGain: alta precisão e velocidade', () => {
  assert.equal(calculateXPGain(65, 97, false), 70);
});

test('calculateXPGain: first completion bonus', () => {
  assert.equal(calculateXPGain(10, 70, true), 45);
});
