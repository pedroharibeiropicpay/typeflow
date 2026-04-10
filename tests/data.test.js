/* ═══════════════════════════════════════════════════════════════
   TypeFlow — Tests: Validação dos dados das lições
   ═══════════════════════════════════════════════════════════════ */

require('./helper.js').loadScript('js/data.js');

const { test } = require('node:test');
const assert = require('node:assert/strict');

// Caracteres permitidos em exercícios
const ALLOWED_CHARS = /^[a-zA-ZçÇàáâãéêíóôõúüÀÁÂÃÉÊÍÓÔÕÚÜ0-9 .,;:!?'"()\-\/]+$/;

test('Todas as lições têm estrutura válida', () => {
  assert.ok(LESSONS.length > 0, 'Deve ter pelo menos uma lição');

  LESSONS.forEach((lesson, i) => {
    assert.ok(lesson.id, `Lição ${i} deve ter id`);
    assert.ok(lesson.chapter, `Lição ${lesson.id} deve ter chapter`);
    assert.ok(lesson.title, `Lição ${lesson.id} deve ter title`);
    assert.ok(lesson.keys, `Lição ${lesson.id} deve ter keys`);
    assert.ok(lesson.desc, `Lição ${lesson.id} deve ter desc`);
    assert.ok(Array.isArray(lesson.exercises), `Lição ${lesson.id} deve ter exercises[]`);
    assert.ok(lesson.exercises.length >= 3, `Lição ${lesson.id} deve ter pelo menos 3 exercícios, tem ${lesson.exercises.length}`);
  });
});

test('IDs das lições são sequenciais começando em 1', () => {
  LESSONS.forEach((lesson, i) => {
    assert.equal(lesson.id, i + 1, `Lição no index ${i} deve ter id ${i + 1}, tem ${lesson.id}`);
  });
});

test('Nenhum exercício contém caracteres estranhos', () => {
  LESSONS.forEach(lesson => {
    lesson.exercises.forEach((ex, j) => {
      assert.match(
        ex, ALLOWED_CHARS,
        `Lição ${lesson.id}, exercício ${j + 1}: contém caractere inválido em "${ex.substring(0, 50)}..."`
      );
    });
  });
});

test('Nenhum exercício contém caractere japonês ou unicode estranho', () => {
  const DANGEROUS = /[ー–—‐‑‒―⁃⁻₋−\u3000-\u9FFF\uF900-\uFAFF\uFF00-\uFFEF]/;
  LESSONS.forEach(lesson => {
    lesson.exercises.forEach((ex, j) => {
      assert.doesNotMatch(
        ex, DANGEROUS,
        `Lição ${lesson.id}, exercício ${j + 1}: contém caractere unicode perigoso`
      );
    });
  });
});

test('Nenhum exercício tem palavras grudadas (sequência > 20 chars sem espaço)', () => {
  LESSONS.forEach(lesson => {
    lesson.exercises.forEach((ex, j) => {
      const words = ex.split(' ');
      words.forEach(word => {
        assert.ok(
          word.length <= 25,
          `Lição ${lesson.id}, exercício ${j + 1}: palavra "${word}" tem ${word.length} chars — provável palavras grudadas`
        );
      });
    });
  });
});

test('Exercícios não são strings vazias', () => {
  LESSONS.forEach(lesson => {
    lesson.exercises.forEach((ex, j) => {
      assert.ok(ex.trim().length > 0, `Lição ${lesson.id}, exercício ${j + 1} está vazio`);
    });
  });
});

test('GAME_WORDS não contém palavras com caracteres inválidos', () => {
  const WORD_CHARS = /^[a-záàâãéêíóôõúüç]+$/;
  GAME_WORDS.forEach(word => {
    assert.match(word, WORD_CHARS, `Game word "${word}" contém caractere inválido`);
  });
});

test('FINGER_MAP cobre todas as teclas do KEYBOARD_ROWS', () => {
  KEYBOARD_ROWS.flat().forEach(key => {
    if (key === '~') return;
    assert.ok(
      FINGER_MAP[key] !== undefined,
      `Tecla "${key}" não tem mapeamento de dedo em FINGER_MAP`
    );
  });
});

test('FINGER_MAP só contém valores válidos de dedo', () => {
  const validFingers = ['pinky', 'ring', 'middle', 'index', 'thumb'];
  Object.entries(FINGER_MAP).forEach(([key, finger]) => {
    assert.ok(
      validFingers.includes(finger),
      `FINGER_MAP["${key}"] = "${finger}" não é um dedo válido`
    );
  });
});
