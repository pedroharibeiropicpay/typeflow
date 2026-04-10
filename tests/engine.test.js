/* ═══════════════════════════════════════════════════════════════
   TypeFlow — Tests: Exercise engine (progressão, WPM, accuracy)
   ═══════════════════════════════════════════════════════════════ */

// Mock localStorage
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

beforeEach(() => {
  Object.keys(storage).forEach(k => delete storage[k]);
  state = createDefaultState();
});

test('resetExercise inicializa corretamente', () => {
  resetExercise('hello', 1, 0);
  assert.equal(exercise.text, 'hello');
  assert.equal(exercise.currentIndex, 0);
  assert.equal(exercise.errors, 0);
  assert.equal(exercise.correctKeys, 0);
  assert.equal(exercise.lessonId, 1);
  assert.equal(exercise.exerciseIndex, 0);
  assert.equal(exercise.charResults.length, 5);
});

test('processKey: acerto incrementa correctKeys e streak', () => {
  resetExercise('abc', 1, 0);
  const result = processKey('a');
  assert.equal(result.correct, true);
  assert.equal(result.expected, 'a');
  assert.equal(result.finished, false);
  assert.equal(exercise.correctKeys, 1);
  assert.equal(exercise.streak, 1);
  assert.equal(exercise.currentIndex, 1);
});

test('processKey: erro incrementa errors e reseta streak', () => {
  resetExercise('abc', 1, 0);
  processKey('a'); // correct, streak=1
  const result = processKey('x'); // wrong
  assert.equal(result.correct, false);
  assert.equal(exercise.errors, 1);
  assert.equal(exercise.streak, 0);
  assert.equal(exercise.maxStreak, 1);
});

test('processKey: finished=true no último caractere', () => {
  resetExercise('ab', 1, 0);
  processKey('a');
  const result = processKey('b');
  assert.equal(result.finished, true);
});

test('processKey: retorna null se já terminou', () => {
  resetExercise('a', 1, 0);
  processKey('a');
  const result = processKey('x');
  assert.equal(result, null);
});

test('processBackspace: volta um índice', () => {
  resetExercise('abc', 1, 0);
  processKey('a');
  assert.equal(exercise.currentIndex, 1);
  const moved = processBackspace();
  assert.equal(moved, true);
  assert.equal(exercise.currentIndex, 0);
});

test('processBackspace: não volta além de 0', () => {
  resetExercise('abc', 1, 0);
  const moved = processBackspace();
  assert.equal(moved, false);
  assert.equal(exercise.currentIndex, 0);
});

test('getExerciseStats: WPM e accuracy corretos', () => {
  resetExercise('hello', 1, 0);
  exercise.startTime = Date.now() - 60000; // 1 minuto atrás
  exercise.correctKeys = 25; // 25/5 = 5 words
  exercise.errors = 5;

  const stats = getExerciseStats();
  assert.equal(stats.wpm, 5);
  assert.equal(stats.accuracy, 83); // 25/(25+5) = 83.3 → 83
});

test('getExerciseStats: 100% accuracy sem erros', () => {
  resetExercise('hi', 1, 0);
  exercise.startTime = Date.now() - 30000;
  exercise.correctKeys = 10;
  exercise.errors = 0;

  const stats = getExerciseStats();
  assert.equal(stats.accuracy, 100);
});

test('finishExercise: avança exerciseIndex no progress', () => {
  resetExercise(LESSONS[0].exercises[0], 1, 0);
  exercise.startTime = Date.now() - 10000;
  exercise.correctKeys = 20;
  exercise.errors = 2;

  finishExercise();

  const prog = state.progress[1];
  assert.equal(prog.exerciseIndex, 1, 'exerciseIndex deve ser 1 após completar exercício 0');
  assert.equal(prog.completed, false, 'lição não deve estar completa após 1 exercício');
  assert.equal(prog.attempts, 1);
});

test('finishExercise: marca completed após último exercício', () => {
  const lesson = LESSONS[0];
  const lastIdx = lesson.exercises.length - 1;

  resetExercise(lesson.exercises[lastIdx], 1, lastIdx);
  exercise.startTime = Date.now() - 10000;
  exercise.correctKeys = 20;
  exercise.errors = 0;

  const results = finishExercise();

  const prog = state.progress[1];
  assert.equal(prog.completed, true, 'lição deve estar completa após último exercício');
  assert.equal(prog.exerciseIndex, 0, 'exerciseIndex deve resetar para 0');
  assert.equal(results.isLastExercise, true);
});

test('getNextExerciseInfo: retorna nextExercise com exerciseIndex do progress', () => {
  resetExercise(LESSONS[0].exercises[0], 1, 0);
  state.progress[1] = { completed: false, bestWpm: 0, bestAccuracy: 0, attempts: 1, exerciseIndex: 2 };

  const next = getNextExerciseInfo();
  assert.equal(next.type, 'nextExercise');
  assert.equal(next.lessonId, 1);
  assert.equal(next.exerciseIndex, 2, 'deve usar exerciseIndex do progress (2), não do exercise (0)');
});

test('getNextExerciseInfo: retorna nextLesson se lição completa', () => {
  resetExercise(LESSONS[0].exercises[4], 1, 4);
  state.progress[1] = { completed: true, bestWpm: 30, bestAccuracy: 90, attempts: 5, exerciseIndex: 0 };

  const next = getNextExerciseInfo();
  assert.equal(next.type, 'nextLesson');
  assert.equal(next.lessonId, 2);
});

test('getNextExerciseInfo: retorna allDone se última lição completa', () => {
  const lastId = LESSONS[LESSONS.length - 1].id;
  resetExercise('test', lastId, 0);
  state.progress[lastId] = { completed: true, bestWpm: 30, bestAccuracy: 90, attempts: 1, exerciseIndex: 0 };

  const next = getNextExerciseInfo();
  assert.equal(next.type, 'allDone');
});

test('BUG FIX: exercícios 1→2→3→4→5 sem repetição', () => {
  const lesson = LESSONS[0]; // 5 exercícios

  for (let i = 0; i < lesson.exercises.length; i++) {
    resetExercise(lesson.exercises[i], 1, i);
    exercise.startTime = Date.now() - 5000;
    exercise.correctKeys = 20;
    exercise.errors = 0;

    finishExercise();
    const prog = state.progress[1];

    if (i < lesson.exercises.length - 1) {
      assert.equal(prog.exerciseIndex, i + 1, `Após exercício ${i}, index deve ser ${i + 1}`);
      assert.equal(prog.completed, false);

      const next = getNextExerciseInfo();
      assert.equal(next.type, 'nextExercise');
      assert.equal(next.exerciseIndex, i + 1,
        `BUG REGRESSÃO: getNextExerciseInfo deve retornar exercício ${i + 1}, retornou ${next.exerciseIndex}`);
    } else {
      assert.equal(prog.completed, true);
      const next = getNextExerciseInfo();
      assert.equal(next.type, 'nextLesson');
      assert.equal(next.lessonId, 2);
    }
  }
});

test('Progressão cross-lição: lição 1 completa → lição 2 desbloqueada', () => {
  const lesson = LESSONS[0];
  for (let i = 0; i < lesson.exercises.length; i++) {
    resetExercise(lesson.exercises[i], 1, i);
    exercise.startTime = Date.now() - 5000;
    exercise.correctKeys = 20;
    exercise.errors = 0;
    finishExercise();
  }

  assert.equal(state.progress[1].completed, true);
  assert.equal(isLessonUnlocked(2), true);
  assert.equal(isLessonUnlocked(3), false);
});
