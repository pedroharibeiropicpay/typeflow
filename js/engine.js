/* ═══════════════════════════════════════════════════════════════
   TypeFlow — Exercise Engine (digitação, WPM, precisão, streaks)
   ═══════════════════════════════════════════════════════════════ */

let exercise = {
  text: '',
  currentIndex: 0,
  errors: 0,
  correctKeys: 0,
  startTime: null,
  timerInterval: null,
  streak: 0,
  maxStreak: 0,
  lessonId: null,
  exerciseIndex: 0,
  keyErrorsThisSession: {},
  charResults: [] // 'correct' | 'incorrect' per char index
};

function resetExercise(text, lessonId, exerciseIndex) {
  stopExerciseTimer();
  exercise = {
    text: text,
    currentIndex: 0,
    errors: 0,
    correctKeys: 0,
    startTime: null,
    timerInterval: null,
    streak: 0,
    maxStreak: 0,
    lessonId: lessonId,
    exerciseIndex: exerciseIndex,
    keyErrorsThisSession: {},
    charResults: new Array(text.length).fill(null)
  };
}

function processKey(typed) {
  if (exercise.currentIndex >= exercise.text.length) return null;

  const expected = exercise.text[exercise.currentIndex];
  const correct = typed === expected;

  state.totalKeystrokes++;

  if (correct) {
    exercise.charResults[exercise.currentIndex] = 'correct';
    exercise.correctKeys++;
    exercise.streak++;
    if (exercise.streak > exercise.maxStreak) exercise.maxStreak = exercise.streak;
  } else {
    exercise.charResults[exercise.currentIndex] = 'incorrect';
    exercise.errors++;
    exercise.streak = 0;

    const errKey = expected.toLowerCase();
    exercise.keyErrorsThisSession[errKey] = (exercise.keyErrorsThisSession[errKey] || 0) + 1;
    state.keyErrors[errKey] = (state.keyErrors[errKey] || 0) + 1;
  }

  exercise.currentIndex++;

  const finished = exercise.currentIndex >= exercise.text.length;

  return { correct, expected, finished };
}

function processBackspace() {
  if (exercise.currentIndex > 0) {
    exercise.currentIndex--;
    exercise.charResults[exercise.currentIndex] = null;
    return true;
  }
  return false;
}

function startExerciseTimer(onTick) {
  if (!exercise.startTime) {
    exercise.startTime = Date.now();
    exercise.timerInterval = setInterval(onTick, 200);
  }
}

function stopExerciseTimer() {
  if (exercise.timerInterval) {
    clearInterval(exercise.timerInterval);
    exercise.timerInterval = null;
  }
}

function getExerciseStats() {
  const elapsed = exercise.startTime ? (Date.now() - exercise.startTime) / 1000 : 0;
  const minutes = elapsed / 60;
  const wpm = minutes > 0 ? Math.round((exercise.correctKeys / 5) / minutes) : 0;
  const total = exercise.correctKeys + exercise.errors;
  const accuracy = total > 0 ? Math.round((exercise.correctKeys / total) * 100) : 100;

  return {
    elapsed,
    wpm,
    accuracy,
    streak: exercise.streak,
    maxStreak: exercise.maxStreak,
    correctKeys: exercise.correctKeys,
    errors: exercise.errors
  };
}

function finishExercise() {
  stopExerciseTimer();

  const stats = getExerciseStats();
  const lesson = LESSONS.find(l => l.id === exercise.lessonId);

  state.totalTime += stats.elapsed;
  if (exercise.maxStreak > state.bestStreak) state.bestStreak = exercise.maxStreak;

  // Save session
  state.sessions.push({
    date: new Date().toISOString(),
    wpm: stats.wpm,
    accuracy: stats.accuracy,
    lessonId: exercise.lessonId
  });

  // Update lesson progress
  const prog = ensureLessonProgress(exercise.lessonId);
  prog.attempts++;
  if (stats.wpm > prog.bestWpm) prog.bestWpm = stats.wpm;
  if (stats.accuracy > prog.bestAccuracy) prog.bestAccuracy = stats.accuracy;

  const nextExIdx = exercise.exerciseIndex + 1;
  const isLastExercise = nextExIdx >= lesson.exercises.length;

  if (isLastExercise) {
    const wasAlreadyCompleted = prog.completed;
    prog.completed = true;
    prog.exerciseIndex = 0;
    var isFirstCompletion = !wasAlreadyCompleted;
  } else {
    prog.exerciseIndex = nextExIdx;
    var isFirstCompletion = false;
  }

  const xpGain = calculateXPGain(stats.wpm, stats.accuracy, isFirstCompletion);
  saveState();
  const leveledUp = addXP(xpGain);

  return {
    ...stats,
    xpGain,
    leveledUp,
    isLastExercise,
    keyErrors: { ...exercise.keyErrorsThisSession },
    lessonId: exercise.lessonId,
    exerciseIndex: exercise.exerciseIndex
  };
}

function getNextExerciseInfo() {
  const prog = getLessonProgress(exercise.lessonId);

  if (prog && prog.completed) {
    // Lesson is complete — next lesson
    const nextLesson = LESSONS.find(l => l.id === exercise.lessonId + 1);
    if (nextLesson) {
      return { type: 'nextLesson', lessonId: nextLesson.id, exerciseIndex: 0 };
    }
    return { type: 'allDone' };
  }

  // Next exercise in same lesson — read from saved progress
  return {
    type: 'nextExercise',
    lessonId: exercise.lessonId,
    exerciseIndex: prog ? prog.exerciseIndex : 0
  };
}
