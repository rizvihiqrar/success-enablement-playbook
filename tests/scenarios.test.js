const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { SCENARIOS } = require('../docs/scenarios.js');

test('every scenario has exactly one best choice and a reason for each choice', () => {
  assert.ok(SCENARIOS.length >= 3);
  for (const s of SCENARIOS) {
    assert.strictEqual(s.choices.filter((c) => c.best).length, 1, `${s.id}: needs exactly one best choice`);
    for (const c of s.choices) assert.ok(c.why && c.why.length > 20, `${s.id}: every choice needs a reason`);
  }
});

test('every scenario points to a guide that exists in the playbook', () => {
  for (const s of SCENARIOS) {
    assert.ok(fs.existsSync(path.join(__dirname, '..', s.guide)), `${s.id}: ${s.guide} not found`);
  }
});
