/* ═══════════════════════════════════════════════════════════════
   TypeFlow — Keyboard Rendering e Highlight
   ═══════════════════════════════════════════════════════════════ */

function renderKeyboard() {
  const container = document.getElementById('keyboard-container');
  if (!state.settings.showKeyboard) { container.classList.add('hidden'); return; }
  container.classList.remove('hidden');

  container.innerHTML = '';
  KEYBOARD_ROWS.forEach((row, rowIdx) => {
    const rowDiv = document.createElement('div');
    rowDiv.className = 'keyboard-row';

    if (rowIdx === 1) {
      rowDiv.appendChild(makeSpecialKey('Tab', 'wide', 'tab'));
    } else if (rowIdx === 2) {
      rowDiv.appendChild(makeSpecialKey('Caps', 'wide', 'caps'));
    } else if (rowIdx === 3) {
      rowDiv.appendChild(makeSpecialKey('Shift', 'wider', 'lshift'));
    }

    row.forEach(k => {
      const finger = FINGER_MAP[k] || '';
      const keyEl = document.createElement('div');
      keyEl.className = `key finger-${finger}`;
      keyEl.dataset.key = k;
      keyEl.textContent = k;
      if (state.settings.showFingers && finger) {
        const dot = document.createElement('span');
        dot.className = 'finger-dot';
        keyEl.appendChild(dot);
      }
      rowDiv.appendChild(keyEl);
    });

    if (rowIdx === 0) rowDiv.appendChild(makeSpecialKey('⌫', 'wider', 'backspace'));
    if (rowIdx === 1) rowDiv.appendChild(makeSpecialKey('\\', '', 'backslash'));
    if (rowIdx === 2) rowDiv.appendChild(makeSpecialKey('Enter', 'wider', 'enter'));
    if (rowIdx === 3) rowDiv.appendChild(makeSpecialKey('Shift', 'wider', 'rshift'));

    container.appendChild(rowDiv);
  });

  // Space row
  const spaceRow = document.createElement('div');
  spaceRow.className = 'keyboard-row';
  spaceRow.appendChild(makeSpecialKey('Ctrl', 'wide', 'lctrl'));
  spaceRow.appendChild(makeSpecialKey('Alt', 'wide', 'lalt'));
  const space = document.createElement('div');
  space.className = 'key space finger-thumb';
  space.dataset.key = ' ';
  space.textContent = '';
  if (state.settings.showFingers) {
    const dot = document.createElement('span');
    dot.className = 'finger-dot';
    space.appendChild(dot);
  }
  spaceRow.appendChild(space);
  spaceRow.appendChild(makeSpecialKey('Alt', 'wide', 'ralt'));
  spaceRow.appendChild(makeSpecialKey('Ctrl', 'wide', 'rctrl'));
  container.appendChild(spaceRow);

  // Finger legend
  if (state.settings.showFingers) {
    const legend = document.createElement('div');
    legend.className = 'finger-legend';
    [
      ['Mindinho', '--finger-pinky'],
      ['Anelar', '--finger-ring'],
      ['Médio', '--finger-middle'],
      ['Indicador', '--finger-index'],
      ['Polegar', '--finger-thumb']
    ].forEach(([name, varName]) => {
      legend.innerHTML += `<span class="finger-legend-item"><span class="finger-legend-dot" style="background:var(${varName})"></span>${name}</span>`;
    });
    container.appendChild(legend);
  }

  // Highlight first key
  if (exercise.text && exercise.currentIndex < exercise.text.length) {
    highlightKey(exercise.text[exercise.currentIndex].toLowerCase());
  }
}

function makeSpecialKey(label, extraClass, id) {
  const el = document.createElement('div');
  el.className = `key ${extraClass}`;
  if (id) el.dataset.key = id;
  el.textContent = label;
  return el;
}

function highlightKey(key) {
  document.querySelectorAll('.key.active').forEach(k => k.classList.remove('active'));
  if (!key) return;
  const el = document.querySelector(`.key[data-key="${key}"]`);
  if (el) el.classList.add('active');
}

function flashKey(key, className) {
  const el = document.querySelector(`.key[data-key="${key}"]`);
  if (!el) return;
  el.classList.add(className);
  setTimeout(() => el.classList.remove(className), 200);
}
