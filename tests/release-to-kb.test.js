const test = require('node:test');
const assert = require('node:assert');
const { section, buildIssue } = require('../scripts/release-to-kb.js');

const body = [
  '## What Changed',
  'Saved filters.',
  '',
  '## Why It Matters',
  'Teams rebuilt filters every day.',
  '',
  '## What To Tell Customers',
  'Filters are private for now.',
  '',
  '## Checklist',
  '- [ ] done',
].join('\r\n');

test('section reads the text under one heading and stops at the next', () => {
  assert.strictEqual(section(body, 'What Changed'), 'Saved filters.');
  assert.strictEqual(section(body, 'What To Tell Customers'), 'Filters are private for now.');
});

test('section returns an empty string when the heading is missing', () => {
  assert.strictEqual(section('no headings here', 'What Changed'), '');
  assert.strictEqual(section(null, 'What Changed'), '');
});

test('buildIssue includes all three sections, the checklist and the pull request link', () => {
  const issue = buildIssue({ number: 7, title: 'Add saved filters', html_url: 'https://example.com/pr/7', body });
  assert.strictEqual(issue.title, 'Enablement review: Add saved filters (PR #7)');
  for (const text of ['Saved filters.', 'Teams rebuilt filters every day.', 'Filters are private for now.', 'Review Checklist', 'https://example.com/pr/7']) {
    assert.ok(issue.body.includes(text), `missing: ${text}`);
  }
});

test('buildIssue says a section is missing instead of leaving a blank', () => {
  const issue = buildIssue({ number: 8, title: 'Quiet change', html_url: 'https://example.com/pr/8', body: '## What Changed\nSomething.' });
  assert.ok(issue.body.includes('Missing in the pull request'));
});
