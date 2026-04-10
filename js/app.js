/* ═══════════════════════════════════════════════════════════════
   TypeFlow — App Init (event listeners, bootstrap)
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  loadState();
  updateHeaderUI();
  navigate('dashboard');

  // Global keydown for exercise
  document.addEventListener('keydown', (e) => {
    if (!document.getElementById('page-exercise').classList.contains('hidden')) {
      handleKeyPress(e);
    }
  });

  // Game input
  document.getElementById('game-input').addEventListener('input', handleGameInput);
  document.getElementById('game-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !game.active) startGame();
  });

  // Focus text display on click
  document.getElementById('text-display').addEventListener('click', () => {
    document.getElementById('text-display').focus();
  });
});
