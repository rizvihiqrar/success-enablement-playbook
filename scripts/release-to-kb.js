// Turns a merged pull request into a review issue for the enablement owner.
// Reads the three template sections, adds a checklist, and writes title.txt and body.md.
// The text from the pull request is only written to files, never run as a command.
const fs = require('fs');
const path = require('path');

const SECTIONS = ['What Changed', 'Why It Matters', 'What To Tell Customers'];

function section(body, name) {
  const text = String(body || '').replace(/\r\n/g, '\n');
  const lines = text.split('\n');
  const start = lines.findIndex((l) => l.trim().toLowerCase() === `## ${name}`.toLowerCase());
  if (start === -1) return '';
  const rest = lines.slice(start + 1);
  const end = rest.findIndex((l) => /^##\s/.test(l));
  return (end === -1 ? rest : rest.slice(0, end)).join('\n').trim();
}

function buildIssue(pr) {
  const parts = SECTIONS.map((name) => {
    const text = section(pr.body, name);
    return `### ${name}\n\n${text || '_Missing in the pull request. Ask the author._'}`;
  });
  const body = [
    `A customer-facing change was merged in pull request #${pr.number} (${pr.html_url}).`,
    'This is a draft from the pull request. A person must check it before any guide changes.',
    ...parts,
    [
      '### Review Checklist',
      '',
      '- [ ] Release note added in `playbook/release-notes/`',
      '- [ ] Entry added to `playbook/CHANGELOG.md`',
      '- [ ] Troubleshooting and onboarding guides that mention this area updated',
      '- [ ] `last_reviewed` and `applies_to` updated in every changed guide',
      '- [ ] Customer team told, with the sentences from "What To Tell Customers"',
    ].join('\n'),
  ].join('\n\n');
  return { title: `Enablement review: ${pr.title} (PR #${pr.number})`, body };
}

if (require.main === module) {
  const [eventPath, outDir] = process.argv.slice(2);
  if (!eventPath || !outDir) {
    console.error('Usage: node scripts/release-to-kb.js <event.json> <output folder>');
    process.exit(1);
  }
  const event = JSON.parse(fs.readFileSync(eventPath, 'utf8'));
  const { title, body } = buildIssue(event.pull_request);
  fs.writeFileSync(path.join(outDir, 'title.txt'), title);
  fs.writeFileSync(path.join(outDir, 'body.md'), body);
  console.log(`Wrote ${path.join(outDir, 'title.txt')} and ${path.join(outDir, 'body.md')}`);
}

module.exports = { section, buildIssue };
