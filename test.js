// --- MOCK TICKET MODEL ---
// This mock is required because the original code imports it from another file.
let globalId = 1000;

/**
 * Represents a single lottery ticket.
 */
class Ticket {
  constructor(username, price) {
    this.id = `T${globalId++}`;
    this.username = username;
    this.price = price;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}

// --- MyDB Class (Copied from User's Input for Self-Containment) ---
// Note: In a real environment, you would use 'const db = require("./db");'
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

    // Corner case handling for quantity <= 0
    if (quantity <= 0) {
      return result;
    }

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
   * @returns {Ticket | undefined} ticket
   */
  findById(ticketId) {
    if (!ticketId || typeof ticketId !== 'string') return undefined; // Robustness check
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
   * @returns {Ticket[]} ticket
   */
  findByUsername(username) {
    if (typeof username !== 'string') return []; // Robustness check
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
   * @returns {Ticket | null} updated Ticket
   */
  updateById(TicketId, TicketBody) {
    const ticket = this.findById(TicketId);
    if (!ticket) return null; // Add null check for robustness
    
    // Check if TicketBody is valid
    if (TicketBody) {
        ticket.username = TicketBody.username ?? ticket.username;
        ticket.price = TicketBody.price ?? ticket.price;
        ticket.updatedAt = new Date();
    }
    
    return ticket;
  }

  /**
   * Updates username and price for ALL tickets associated with a username.
   * @param {string} username
   * @param {{username : string, price : number}} TicketBody
   * @returns {Ticket[] | null} updated Tickets array or null if none found.
   */
  updateByUsername(username, TicketBody) {
    const updatedTickets = [];

    // Check if TicketBody is valid
    if (!TicketBody) return null;
    
    // Iterate over all tickets and update matching ones
    this.ticket.forEach(t => {
      if (t.username === username) {
        t.username = TicketBody.username ?? t.username;
        t.price = TicketBody.price ?? t.price;
        t.updatedAt = new Date();
        updatedTickets.push(t);
      }
    });

    return updatedTickets.length > 0 ? updatedTickets : null;
  }

  /**
   *
   * @param {string} TicketId
   * @returns {Ticket[] | false} deleted ticket array or false
   */
  deleteById(TicketId) {
    const index = this.ticket.findIndex(
      /**
       *
       * @param {Ticket} ticket
       * @returns {number} index
       */
      (ticket) => ticket.id === TicketId
    );

    if (index === -1) {
      return false;
    } else {
      return this.ticket.splice(index, 1);
    }
  }


  /**
   * Deletes ALL tickets associated with a username.
   * @param {string} username
   * @returns {Ticket[] | false} deleted ticket array or false
   */
  deleteByUsername(username) {
    const deletedTickets = this.ticket.filter((t) => t.username === username);
    
    if (deletedTickets.length === 0) {
        return false;
    }

    // Filter out tickets that do *not* match the username, effectively deleting the others
    this.ticket = this.ticket.filter((t) => t.username !== username);

    return deletedTickets;
  }

  /**
   *
   * @param {number} winnerCount
   * @returns {Ticket[]}
   */
  draw(winnerCount) {
    // Corner case: Handle negative or non-numeric input
    if (typeof winnerCount !== 'number' || winnerCount < 0) {
        return [];
    }

    if (winnerCount === 0) {
        return [];
    }
    
    if (winnerCount >= this.ticket.length) {
      return this.ticket
    }

    // Use a Set for efficient tracking of unique indices
    const winningIndices = new Set();

    while (winningIndices.size < winnerCount) {
        // Generate a random index between 0 (inclusive) and this.ticket.length (exclusive)
        const index = Math.floor(Math.random() * this.ticket.length);
        winningIndices.add(index);
    }

    // Convert Set of indices back to an array and map to tickets
    const winner = Array.from(winningIndices).map((index) => this.ticket[index])

    return winner

  }
}

const db = new MyDB();


// --- TEST EXECUTION ---

function assert(condition, message) {
    if (!condition) {
        console.error(`❌ FAILED: ${message}`);
        // Optionally throw an error to stop execution on critical failures
        // throw new Error(message);
    } else {
        console.log(`✅ PASSED: ${message}`);
    }
}

/**
 * Executes a series of tests focused on corner cases, boundary conditions,
 * and invalid/extreme inputs.
 */
function runCornerCaseTests() {
    console.log("\n--- Starting Corner Case Tests ---");
    // Use a fresh database for isolated corner case testing
    const db_corner = new MyDB();

    // Max Safe Integer for Price
    const MAX_PRICE = Number.MAX_SAFE_INTEGER;
    const ticketMax = db_corner.create("Max", MAX_PRICE);
    assert(ticketMax.price === MAX_PRICE, "create(): Price set to Number.MAX_SAFE_INTEGER.");

    // Zero and Negative Values
    const ticketZero = db_corner.create("ZeroPrice", 0);
    const ticketNeg = db_corner.create("NegativePrice", -10.5);
    assert(ticketZero.price === 0, "create(): Price set to 0.");
    assert(ticketNeg.price === -10.5, "create(): Price set to negative value.");

    // Username Edge Cases: Empty string and Special Characters
    const ticketEmptyUser = db_corner.create("", 5);
    const ticketSpecialUser = db_corner.create("!@#$%^", 5);
    db_corner.create("", 10); // Create a second empty user ticket for update/delete all tests
    assert(db_corner.findByUsername("").length === 2, "findByUsername(): Should find 2 tickets with empty string username.");
    assert(db_corner.findByUsername("!@#$%^").length === 1, "findByUsername(): Should find ticket with special character username.");

    // bulkCreate Corner Cases
    const zeroBulk = db_corner.bulkCreate("NoBulk", 1, 0);
    assert(zeroBulk.length === 0, "bulkCreate(): Quantity 0 should return empty array.");
    const negBulk = db_corner.bulkCreate("NegBulk", 1, -5);
    assert(negBulk.length === 0, "bulkCreate(): Negative quantity should return empty array.");
    
    const initialTotal = db_corner.find().length; // 6 tickets so far (Max, ZeroPrice, NegPrice, Empty[2], Special)

    // findById Edge Cases (Non-existent/Invalid input)
    assert(db_corner.findById("X" + ticketMax.id) === undefined, "findById(): Non-existent ID should return undefined.");
    assert(db_corner.findById("") === undefined, "findById(): Empty string ID should return undefined.");
    assert(db_corner.findById(null) === undefined, "findById(): null input should return undefined (due to robustness check).");
    assert(db_corner.findById(ticketMax.id) !== undefined, "findById(): Should find a valid ticket.");

    // findByUsername Edge Cases (Non-existent/Invalid input)
    assert(db_corner.findByUsername("NonExistent").length === 0, "findByUsername(): Non-existent username should return empty array.");
    assert(db_corner.findByUsername(null).length === 0, "findByUsername(): null input should return empty array (due to robustness check).");

    // updateById Edge Cases
    assert(db_corner.updateById("NonExistentId", { price: 999 }) === null, "updateById(): Non-existent ID should return null.");
    const updateOnlyPrice = db_corner.updateById(ticketZero.id, { price: 99 });
    assert(updateOnlyPrice.price === 99 && updateOnlyPrice.username === "ZeroPrice", "updateById(): Should update price only.");
    const updateNoBody = db_corner.updateById(ticketZero.id, null);
    assert(updateNoBody.price === 99, "updateById(): Null body should result in no change to properties.");

    // updateByUsername Edge Cases (Now updating all matching tickets)
    assert(db_corner.updateByUsername("NonExistent", { price: 100 }) === null, "updateByUsername(): Non-existent username should return null.");
    
    // Test updating both empty string tickets (2 of them)
    const updatedEmptyTickets = db_corner.updateByUsername("", { price: 500 });
    assert(updatedEmptyTickets.length === 2, "updateByUsername(): Should update ALL 2 empty string tickets.");
    assert(db_corner.findByUsername("").every(t => t.price === 500), "ALL updated empty tickets should have the new price 500.");
    
    const updateUsernameNoBody = db_corner.updateByUsername("NegativePrice", null);
    assert(updateUsernameNoBody === null, "updateByUsername(): Null body should return null.");


    // deleteById Edge Cases
    const ticketToDelId = ticketNeg.id; 
    assert(db_corner.deleteById("NonExistentId") === false, "deleteById(): Non-existent ID should return false.");
    assert(db_corner.deleteById(ticketToDelId).length === 1, "deleteById(): Should successfully delete an existing ticket (NegativePrice).");
    assert(db_corner.find().length === initialTotal - 1, "deleteById(): Total count should be reduced by 1 (5 tickets left).");
    assert(db_corner.deleteById(ticketToDelId) === false, "deleteById(): Should return false when trying to delete already deleted ID.");

    // deleteByUsername Edge Cases (Now deleting all matching tickets)
    assert(db_corner.deleteByUsername("NonExistentUser") === false, "deleteByUsername(): Non-existent username should return false.");
    
    // Delete all empty string tickets (2 of them)
    const emptyCount = db_corner.findByUsername("").length; // Should be 2
    const deletedByUsernameResult = db_corner.deleteByUsername(""); 
    assert(deletedByUsernameResult.length === emptyCount, "deleteByUsername(): Should successfully delete ALL 2 empty string tickets.");
    assert(db_corner.findByUsername("").length === 0, "deleteByUsername(): Should leave 0 remaining tickets with empty username.");
    assert(db_corner.find().length === initialTotal - 1 - emptyCount, "Total count should be reduced by 2 more (3 tickets left).");
    
    // Draw Logic Corner Cases
    assert(db_corner.draw(0).length === 0, "draw(): Winner count of 0 should return empty array.");
    const drawMax = db_corner.draw(db_corner.find().length);
    assert(drawMax.length === db_corner.find().length, "draw(): Winner count equal to total tickets should return all tickets.");
    const drawOverMax = db_corner.draw(db_corner.find().length + 5);
    assert(drawOverMax.length === db_corner.find().length, "draw(): Winner count > total tickets should return all tickets.");
    
    console.log("--- Corner Case Tests Completed ---");
}

function runTests() {
    console.log("--- Starting MyDB Unit Tests (Base Cases) ---");

    // 1. Test create() and find()
    const ticket1 = db.create("Alice", 100);
    const ticket2 = db.create("Bob", 200);
    const allTickets = db.find();

    assert(ticket1.username === "Alice" && ticket1.price === 100, "create() should create a ticket with correct properties.");
    assert(allTickets.length === 2, "find() should return all tickets (2).");
    console.log(`Ticket 1 ID: ${ticket1.id}`);
    console.log(`Ticket 2 ID: ${ticket2.id}`);

    // 2. Test bulkCreate()
    const bulkTickets = db.bulkCreate("Charlie", 50, 3);
    assert(bulkTickets.length === 3, "bulkCreate() should create the specified quantity (3).");
    assert(db.find().length === 5, "find() should now show total 5 tickets.");

    // 3. Test findById()
    const foundTicket1 = db.findById(ticket1.id);
    const notFoundTicket = db.findById("NonExistentId");

    assert(foundTicket1 !== undefined && foundTicket1.username === "Alice", "findById() should find the correct ticket by ID.");
    assert(notFoundTicket === undefined, "findById() should return undefined for non-existent ID.");

    // 4. Test findByUsername()
    const aliceTickets = db.findByUsername("Alice");
    const charlieTickets = db.findByUsername("Charlie");

    assert(aliceTickets.length === 1 && aliceTickets[0].price === 100, "findByUsername() should find 1 ticket for Alice.");
    assert(charlieTickets.length === 3, "findByUsername() should find 3 tickets for Charlie.");

    // 5. Test updateById()
    const newPrice = 150;
    const updatedTicket = db.updateById(ticket1.id, { price: newPrice });

    assert(updatedTicket.price === newPrice, "updateById() should update the ticket price.");
    assert(updatedTicket.username === "Alice", "updateById() should not change username if not provided.");
    assert(db.findById(ticket1.id).price === newPrice, "The ticket in the database should be updated.");

    // 6. Test updateByUsername() - (Now updates ALL matching tickets)
    const initialCharlieTickets = db.findByUsername("Charlie"); // Should be 3
    const initialCharlieCount = initialCharlieTickets.length; 
    const newPriceForCharlie = 75;
    
    const updatedCharlieTickets = db.updateByUsername("Charlie", { price: newPriceForCharlie });

    assert(updatedCharlieTickets.length === initialCharlieCount, "updateByUsername() should now update ALL matching tickets (3).");
    assert(updatedCharlieTickets.every(t => t.price === newPriceForCharlie), "ALL 'Charlie' tickets should have the new price.");
    assert(db.findByUsername("Charlie").length === initialCharlieCount, "No tickets should be added or removed.");

    // 7. Test deleteById()
    const deleteResult1 = db.deleteById(ticket2.id); // Bob's ticket
    const totalAfterDelete1 = db.find().length; // Should be 4
    const deleteResult2 = db.deleteById("NonExistentId");

    assert(deleteResult1 && deleteResult1.length === 1 && totalAfterDelete1 === 4, "deleteById() should successfully delete a ticket and reduce total count.");
    assert(deleteResult2 === false, "deleteById() should return false for a non-existent ID.");

    // 8. Test deleteByUsername() - (Now deletes ALL matching tickets)
    const initialTotal = db.find().length; // Should be 4 (Alice, Charlie[3])
    const charlieCountBeforeDelete = db.findByUsername("Charlie").length; // Should be 3

    const deleteByUsernameResult = db.deleteByUsername("Charlie"); // Should delete all 3
    const finalCharlieCount = db.findByUsername("Charlie").length; // Should be 0
    const finalTotal = db.find().length; // Should be 4 - 3 = 1

    assert(deleteByUsernameResult && deleteByUsernameResult.length === charlieCountBeforeDelete, "deleteByUsername() should delete ALL tickets (3).");
    assert(finalCharlieCount === 0, "deleteByUsername() should leave 0 remaining 'Charlie' tickets.");
    assert(finalTotal === initialTotal - charlieCountBeforeDelete, "Total tickets should reflect all deleted tickets (1 remaining - Alice).");
    assert(db.deleteByUsername("NonExistentUser") === false, "deleteByUsername() should return false for non-existent user.");

    // 9. Test draw()
    const winners = db.draw(1);
    const allWinners = db.draw(10); // More winners than tickets (1 remaining: Alice)

    assert(winners.length === 1, "draw() should return the requested number of winners (1).");
    assert(allWinners.length === 1, "draw() with winner count > total tickets should return all tickets (1).");
    console.log("--- Base Case Tests Completed ---");
}

// Execute the tests
runTests();
runCornerCaseTests();
