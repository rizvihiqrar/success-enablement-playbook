// Practice scenarios for the Tasklane triage simulator. Each has one best next step and a reason for every choice.
const SCENARIOS = [
  {
    id: 'reminders-late',
    title: 'Reminders Arrive Hours Late',
    situation: 'A customer writes: "My reminders keep arriving three hours after the time I set. This is the second week." What do you do first?',
    guide: 'playbook/troubleshooting/reminders-not-arriving.md',
    choices: [
      { text: 'Ask the customer to check the time zone in their profile.', best: true,
        why: 'A wrong time zone is the most common cause of late or early reminders, and it takes one minute to check.' },
      { text: 'Tell the customer it is a known bug and the team is working on it.', best: false,
        why: 'Nothing shows that this is a bug. Saying so without evidence sets a false expectation and hides a quick fix.' },
      { text: 'Ask for screenshots of the whole screen, including the sign-in details.', best: false,
        why: 'Never ask for screenshots that may show passwords. Ask for the task link and the expected time instead.' },
    ],
  },
  {
    id: 'cannot-sign-in',
    title: 'Customer Cannot Sign In After Changing Email',
    situation: 'A customer says: "I changed my email last week and now I cannot sign in. The password reset email is not coming." What do you do first?',
    guide: 'playbook/troubleshooting/cannot-sign-in.md',
    choices: [
      { text: 'Reset the password for them and send it by email.', best: false,
        why: 'Support must never set or send a password. The customer chooses their own with the reset link.' },
      { text: 'Ask which email address they are typing, then guide them through Forgot password with the new address.', best: true,
        why: 'After an email change the old address stops working, so confirming the address is the fastest check, and the reset keeps the password private.' },
      { text: 'Ask them to create a new account with the new email.', best: false,
        why: 'A second account splits their tasks and settings across two places, and it does not fix the real problem.' },
    ],
  },
  {
    id: 'saved-filters',
    title: 'Customer Asks For Shared Saved Filters',
    situation: 'A customer asks: "Saved filters are great. Can I share mine with my whole team? When will that be ready?" What do you say?',
    guide: 'playbook/release-notes/2026-11-saved-filters.md',
    choices: [
      { text: 'Say sharing will be ready next month.', best: false,
        why: 'The release note says sharing is planned with no date. Promising a date you do not own causes broken trust later.' },
      { text: 'Say saved filters are private for now, sharing is planned with no date yet, and offer to pass the request to the product team.', best: true,
        why: 'This matches the release note, is honest about the limit, and turns the question into useful product feedback.' },
      { text: 'Say you are not sure and ask them to look at the website.', best: false,
        why: 'The answer is in the release note. Check the guide first, then answer, and tell the guide owner if the answer was hard to find.' },
    ],
  },
];

if (typeof module !== 'undefined') module.exports = { SCENARIOS };
