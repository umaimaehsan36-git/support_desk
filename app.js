import { Ticket } from './ticket.js';
import { validateTicket, filterTickets, summarize, escapeHtml } from './utils.js';

let tickets = [];          // array of Ticket objects
let editingId = null;      // id of ticket being edited (null = adding)

const $ = (id) => document.getElementById(id);
const form = $('ticketForm');
const fields = ['name', 'issue', 'priority', 'status'];

const readForm = () => ({
  name: $('name').value,
  issue: $('issue').value,
  priority: $('priority').value,
  status: $('status').value,
});

// ---------- Rendering ----------
const statusClass = { 'Open': 'text-bg-success', 'In Progress': 'text-bg-warning', 'Closed': 'text-bg-secondary' };

const cardHtml = ({ id, name, issue, priority, status }) => `
  <article class="ticket p-${priority}">
    <span class="tid">#${id}</span>
    <strong>${escapeHtml(name)}</strong>
    <p>${escapeHtml(issue)}</p>
    <span class="badge text-bg-dark">${priority}</span>
    <span class="badge ${statusClass[status]}">${status}</span>
    <div class="mt-2 d-flex gap-1">
      <button class="btn btn-sm btn-outline-primary" data-action="edit" data-id="${id}">Edit</button>
      <button class="btn btn-sm btn-outline-danger" data-action="delete" data-id="${id}">Delete</button>
    </div>
  </article>`;

const render = () => {
  const visible = filterTickets(tickets, {
    keyword: $('search').value,
    status: $('filterStatus').value,
    priority: $('filterPriority').value,
  });

  $('ticketList').innerHTML = visible.length
    ? visible.map(cardHtml).join('')
    : '<p class="text-muted m-0">No tickets found.</p>';

  const totals = summarize(tickets);
  $('sumOpen').textContent = totals.Open;
  $('sumProgress').textContent = totals['In Progress'];
  $('sumClosed').textContent = totals.Closed;
  $('totalBadge').textContent = `Total: ${tickets.length}`;
  $('showingBadge').textContent = `Showing ${visible.length} of ${tickets.length}`;
};

// ---------- Form helpers ----------
const showErrors = (errors) => {
  ['name', 'issue'].forEach((key) => {
    const hasError = key in errors;
    $(key).classList.toggle('is-invalid', hasError);
    $(`${key}Error`).textContent = errors[key] ?? '';
  });
};

const resetForm = () => {
  form.reset();                      // restores default select values
  showErrors({});
  editingId = null;
  $('formTitle').textContent = 'New Ticket';
  $('submitBtn').textContent = 'Add Ticket';
};

// ---------- Events ----------
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = readForm();
  const errors = validateTicket(data);
  showErrors(errors);
  if (Object.keys(errors).length > 0) return;

  const clean = { ...data, name: data.name.trim(), issue: data.issue.trim() };

  if (editingId === null) {
    tickets = [...tickets, new Ticket(clean)];
  } else {
    tickets = tickets.map(t => (t.id === editingId ? Object.assign(t, clean) : t));
  }
  resetForm();
  render();
});

$('resetBtn').addEventListener('click', resetForm);

$('ticketList').addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-action]');
  if (!btn) return;
  const id = Number(btn.dataset.id);

  if (btn.dataset.action === 'delete') {
    tickets = tickets.filter(t => t.id !== id);
    if (editingId === id) resetForm();
    render();
  } else {
    const ticket = tickets.find(t => t.id === id);
    fields.forEach(f => { $(f).value = ticket[f]; });
    editingId = id;
    $('formTitle').textContent = `Edit Ticket #${id}`;
    $('submitBtn').textContent = 'Save Changes';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

['search', 'filterStatus', 'filterPriority'].forEach(id =>
  $(id).addEventListener('input', render));

render();
