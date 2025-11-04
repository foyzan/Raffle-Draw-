const Ticket = require("../models/ticket");

class MyDB {
  constructor() {
    this.ticket = [];
  }

  /**
   * create new ticket
   * @param {string} username
   * @param {number} price
   * @returns {Ticket} Ticket
   */
  create(username, price) {
    const ticket = new Ticket(username, price);
    this.ticket.push(ticket);
    return ticket;
  }

  /**
   * create multiple ticket at once
   * @param {string} username
   * @param {number} price
   * @param {number} quantity
   * @returns {Array<Ticket>}
   */
  bulkCreate(username, price, quantity) {
    const result = [];

    for (let i = 0; i < quantity; i++) {
      const ticket = this.create(username, price);
      result.push(ticket);
    }

    return result;
  }

  find() {
    return this.ticket;
  }

  /**
   * find ticket by Id
   * @param {string} ticketId
   * @returns {Ticket} ticket
   */
  findById(ticketId) {
    const ResultTicket = this.ticket.find(
      /**
       *
       * @param {Ticket} ticket
       */
      (ticket) => ticket.id === ticketId
    );

    return ResultTicket;
  }

  /**
   *
   * @param {string} username
   * @returns {Ticket} ticket
   */
  findByUsername(username) {
    const ResultTicket = this.ticket.filter(
      /**
       *
       * @param {Ticket} ticket
       */
      (ticket) => ticket.username === username
    );

    return ResultTicket;
  }

  /**
   * update username and price By Id
   * @param {string} TicketId
   * @param {{username : string, price: number}} TicketBody
   * @returns {Ticket} updated Ticket
   */
  updateById(TicketId, TicketBody) {
    const ticket = this.findById(TicketId);
    ticket.username = TicketBody.username ?? ticket.username;
    ticket.price = TicketBody.price ?? ticket.price;
    ticket.updatedAt = new Date();

    return ticket;
  }

  /**
   * UPDATE ALL tickets belonging to a specific username.
   * @param {string} username
   * @param {{username : string, price : number}} TicketBody
   * @returns {Array<Ticket> | false} array of updated tickets, or false if none found
   */
  updateByUsername(username, TicketBody) {
    console.log(username);
    const updatedTickets = [];
    for (let i = 0; i < this.ticket.length; i++) {
      if (this.ticket[i].username === username) {
        this.ticket[i].username =
        TicketBody.username ?? this.ticket[i].username;
        this.ticket[i].price = TicketBody.price ?? this.ticket[i].price;
        this.ticket[i].updatedAt = new Date();


        updatedTickets.push(this.ticket[i]);
      }
    }
    return updatedTickets;
  }

  /**
   *
   * @param {string} TicketId
   */
  deleteById(TicketId) {
    console.log(TicketId);
    const index = this.ticket.findIndex(
      /**
       *
       * @param {Ticket} ticket
       * @returns {number} index
       */
      (ticket) => ticket.id === TicketId
    );

    console.log(index);

    if (index === -1) {
      return false;
    } else {
      return this.ticket.splice(index, 1);
    }
  }

  /**
   *
   * @param {string} username
   * @returns {[Ticket]}
   */
  deleteByUsername(username) {
    const deletedTickets = [];

    // Iterate backward to safely use splice without disrupting array indices
    // during iteration.
    for (let i = this.ticket.length - 1; i >= 0; i--) {
      if (this.ticket[i].username === username) {
        // splice returns an array of the deleted element(s)
        const deleted = this.ticket.splice(i, 1);
        // Prepend to maintain the original order of creation/insertion
        deletedTickets.unshift(deleted[0]);
      }
    }

    // Return the array of deleted tickets, or false if none were deleted
    return deletedTickets.length > 0 ? deletedTickets : false;
  }

  /**
   *
   * @param {number} winnerCount
   */
  draw(winnerCount) {
    if (winnerCount >= this.ticket.length) {
      return this.ticket;
    }

    const indexArr = new Array(winnerCount);

    for (let i = 0; i < indexArr.length; i++) {
      let index = Math.floor(Math.random() * this.ticket.length);
      while (indexArr.includes(index)) {
        index = Math.floor(Math.random() * this.ticket.length);
      }
      indexArr[i] = index;
    }

    const winner = indexArr.map((index) => this.ticket[index]);
    console.log(indexArr);

    return winner;
  }
}

const db = new MyDB();

module.exports = db;
