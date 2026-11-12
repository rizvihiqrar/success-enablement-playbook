// Checks the playbook so guides cannot quietly go stale or broken.
// Errors (exit 1): missing owner, review date or version; broken links; a release note missing from the changelog.
// Warnings (exit 0): a guide not reviewed in the last 90 days.
const fs = require('fs');
const path = require('path');

const STALE_DAYS = 90;
const REQUIRED = ['owner', 'last_reviewed', 'applies_to'];

function markdownFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const full = path.join(dir, e.name);
    return e.isDirectory() ? markdownFiles(full) : e.name.endsWith('.md') ? [full] : [];
  });
}

function frontMatter(text) {
  const m = /^---\n([\s\S]*?)\n---\n/.exec(text.replace(/\r\n/g, '\n'));
  if (!m) return null;
  const out = {};
  for (const line of m[1].split('\n')) {
    const i = line.indexOf(':');
    if (i > 0) out[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return out;
}

function checkPlaybook(root, today = new Date()) {
  const errors = [];
  const warnings = [];
  const files = markdownFiles(root);
  const changelogPath = path.join(root, 'CHANGELOG.md');
  const changelog = fs.existsSync(changelogPath) ? fs.readFileSync(changelogPath, 'utf8') : '';
  if (!changelog) errors.push('CHANGELOG.md is missing');

  for (const file of files) {
    const rel = path.relative(root, file).split(path.sep).join('/');
    if (rel === 'CHANGELOG.md') continue;
    const text = fs.readFileSync(file, 'utf8');
    const fm = frontMatter(text);
    if (!fm) {
      errors.push(`${rel}: no front matter (owner, last_reviewed, applies_to)`);
    } else {
      for (const key of REQUIRED) if (!fm[key]) errors.push(`${rel}: missing ${key}`);
      if (fm.last_reviewed) {
        const date = new Date(fm.last_reviewed);
        if (Number.isNaN(date.getTime())) errors.push(`${rel}: last_reviewed is not a date (${fm.last_reviewed})`);
        else if ((today - date) / 86400000 > STALE_DAYS) warnings.push(`${rel}: not reviewed in ${STALE_DAYS} days (last ${fm.last_reviewed})`);
      }
    }
    for (const m of text.matchAll(/\]\(([^)#\s]+\.md)(#[^)]*)?\)/g)) {
      if (/^https?:/.test(m[1])) continue;
      if (!fs.existsSync(path.resolve(path.dirname(file), m[1]))) errors.push(`${rel}: broken link to ${m[1]}`);
    }
    if (rel.startsWith('release-notes/') && !changelog.includes(path.basename(rel))) {
      errors.push(`${rel}: not listed in CHANGELOG.md`);
    }
  }
  return { errors, warnings, checked: files.length };
}

if (require.main === module) {
  const root = path.resolve(__dirname, '..', 'playbook');
  const { errors, warnings, checked } = checkPlaybook(root);
  for (const w of warnings) console.log(`warning: ${w}`);
  for (const e of errors) console.log(`error: ${e}`);
  console.log(`${checked} files checked, ${errors.length} errors, ${warnings.length} warnings`);
  process.exit(errors.length ? 1 : 0);
}

module.exports = { checkPlaybook, frontMatter };
