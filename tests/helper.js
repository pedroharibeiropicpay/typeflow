/* Helper para carregar scripts do browser no contexto global do Node.js */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');

function loadScript(relPath) {
  const code = fs.readFileSync(path.join(ROOT, relPath), 'utf8');
  // Browser scripts usam const/let no escopo top-level.
  // vm.runInThisContext com const/let os trata como block-scoped.
  // Convertemos para var para que fiquem no escopo global.
  const patched = code.replace(/^(const|let) /gm, 'var ');
  vm.runInThisContext(patched, { filename: relPath });
}

function loadAll() {
  loadScript('js/data.js');
  loadScript('js/state.js');
  loadScript('js/engine.js');
}

module.exports = { loadScript, loadAll };
