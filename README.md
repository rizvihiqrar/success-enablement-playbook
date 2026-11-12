# Success Enablement Playbook

A small, working example of how I would run product enablement for a team that talks to customers: the written guides live in Git, a change to the product opens a review task for the enablement owner, and new hires practise on a short simulator before they take real cases.

The product is made up. **Tasklane** is an imaginary team to-do app with reminders and saved filters, so nothing here comes from a real company or a real customer.

## The Three Parts

| Part | Where | What it shows |
| --- | --- | --- |
| Docs-as-Code playbook | [playbook/](playbook/) | Onboarding, release notes and troubleshooting guides written as Markdown, each with an owner, a review date and the product version it applies to |
| Release-to-knowledge-base workflow | [.github/workflows/release-to-kb.yml](.github/workflows/release-to-kb.yml) | A merged pull request labelled `customer-facing` opens a review issue for the enablement owner with a draft summary and a checklist |
| Triage simulator | [docs/](docs/) | A three-scenario practice page: pick the right next step and read why |

## How the Parts Work Together

1. A product change is described in a pull request, using the [pull request template](.github/PULL_REQUEST_TEMPLATE.md): what changed, why it matters, and what to tell customers.
2. When the pull request is merged with the `customer-facing` label, the workflow turns those three sections into a review issue assigned to the enablement owner. A person checks the draft, updates the guides, and closes the issue.
3. The guide changes go through their own pull request. The [playbook check](scripts/check-playbook.js) fails the build if a guide has no owner, review date or version, if a link is broken, or if a release note is missing from the [changelog](playbook/CHANGELOG.md).
4. New hires practise the common problems in the simulator before their first cases.

## What a Person Still Does

Nothing publishes by itself. The workflow drafts and assigns, and the enablement owner reads, corrects and approves. In the walkthrough I also use an AI assistant to write a first draft of a guide from rough notes, then correct it by hand. The AI step is not part of the automation, because every draft needs a person to check it first.

## Run It

```
npm test
npm run check
```

No packages are needed, only Node 20 or newer. The simulator is a plain web page: open `docs/index.html`, or use the GitHub Pages link once Pages is turned on.

## Files

```
playbook/            Guides: onboarding, release-notes, troubleshooting, CHANGELOG.md
scripts/             release-to-kb.js (builds the review issue), check-playbook.js (the check)
tests/               Tests for both scripts and the simulator scenarios
docs/                The triage simulator (plain HTML, CSS and JavaScript)
.github/             Pull request template and the two workflows
```
