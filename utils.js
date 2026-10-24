// Pure helper functions: validation, filtering and summary

export const validateTicket = ({ name, issue }) => {
  const errors = {};
  const cleanName = name.trim();
  const cleanIssue = issue.trim();

  if (cleanName === '') errors.name = 'Customer name is required.';
  else if (cleanName.length < 3) errors.name = 'Name must be at least 3 characters.';
  else if (!/^[A-Za-z .'-]+$/.test(cleanName)) errors.name = 'Name can only contain letters.';

  if (cleanIssue === '') errors.issue = 'Please describe the issue.';
  else if (cleanIssue.length < 10) errors.issue = 'Issue must be at least 10 characters.';

  return errors;
};

export const filterTickets = (tickets, { keyword = '', status = '', priority = '' }) => {
  const word = keyword.trim().toLowerCase();
  return tickets.filter(t =>
    (word === '' || t.issue.toLowerCase().includes(word)) &&
    (status === '' || t.status === status) &&
    (priority === '' || t.priority === priority)
  );
};

export const summarize = (tickets) => {
  const totals = { Open: 0, 'In Progress': 0, Closed: 0 };
  for (const { status } of tickets) {
    totals[status] += 1;
  }
  return totals;
};

export const escapeHtml = (text) =>
  text.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
