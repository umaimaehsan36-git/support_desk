// Ticket model (ES6 class) - exported as a module
export class Ticket {
  static #counter = 0;

  constructor({ name, issue, priority = 'Medium', status = 'Open' }) {
    this.id = ++Ticket.#counter;
    this.name = name;
    this.issue = issue;
    this.priority = priority;
    this.status = status;
  }

  isOpen() {
    return this.status === 'Open';
  }
}
