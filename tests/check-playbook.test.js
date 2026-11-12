const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { checkPlaybook } = require('../scripts/check-playbook.js');

function makePlaybook(files) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'playbook-'));
  for (const [rel, text] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(root, rel)), { recursive: true });
    fs.writeFileSync(path.join(root, rel), text);
  }
  return root;
}
const fm = (extra = '') => `---\nowner: A\nlast_reviewed: 2026-11-01\napplies_to: 4.2\n---\n# Title\n${extra}\n`;
const today = new Date('2026-11-12');

test('a clean playbook has no errors', () => {
  const root = makePlaybook({
    'CHANGELOG.md': '# Changelog\n- release-notes/a.md\n',
    'release-notes/a.md': fm(),
    'troubleshooting/b.md': fm('[a](../release-notes/a.md)'),
  });
  assert.deepStrictEqual(checkPlaybook(root, today).errors, []);
});

test('a guide with no owner is an error', () => {
  const root = makePlaybook({
    'CHANGELOG.md': '# Changelog\n',
    'troubleshooting/b.md': '---\nlast_reviewed: 2026-11-01\napplies_to: 4.2\n---\n# T\n',
  });
  assert.ok(checkPlaybook(root, today).errors.some((e) => e.includes('missing owner')));
});

test('a broken link is an error', () => {
  const root = makePlaybook({
    'CHANGELOG.md': '# Changelog\n',
    'troubleshooting/b.md': fm('[gone](nothing.md)'),
  });
  assert.ok(checkPlaybook(root, today).errors.some((e) => e.includes('broken link')));
});

test('a release note missing from the changelog is an error', () => {
  const root = makePlaybook({
    'CHANGELOG.md': '# Changelog\n',
    'release-notes/a.md': fm(),
  });
  assert.ok(checkPlaybook(root, today).errors.some((e) => e.includes('not listed in CHANGELOG.md')));
});

test('a guide not reviewed for 90 days is a warning, not an error', () => {
  const root = makePlaybook({
    'CHANGELOG.md': '# Changelog\n',
    'troubleshooting/b.md': '---\nowner: A\nlast_reviewed: 2026-01-01\napplies_to: 4.2\n---\n# T\n',
  });
  const result = checkPlaybook(root, today);
  assert.deepStrictEqual(result.errors, []);
  assert.strictEqual(result.warnings.length, 1);
});
