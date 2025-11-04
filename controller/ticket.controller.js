const myDb = require("../db/db");

const getTicketById = (req, res) => {
  const ticketId = req.params.ticketId;
  const ticket = myDb.findById(ticketId);

  if (ticket) {
    return res.status(200).json({
      success: true,
      message: "ticket found",
      ticket: ticket,
    });
  } else {
    return res.status(404).json({
      success: false,
      message: "ticket not found",
      ticket: ticket,
    });
  }
};
const updateTicketById = (req, res) => {
  const ticketId = req.params.ticketId;
  const updatedTicket = myDb.updateById(ticketId, req.body);

  if (updatedTicket) {
    return res.status(200).json({
      success: true,
      message: "ticket updated",
      ticket: updatedTicket,
    });
  } else {
    return res.status(404).json({
      success: false,
      message: "ticket not updated",
      ticket: updatedTicket,
    });
  }
};
const deleteTicketById = (req, res) => {
    const ticketID = req.params.ticketId;
    const deleteTicket = myDb.deleteById(ticketID);

    if (deleteTicket) {
    return res.status(200).json({
      success: true,
      message: "ticket deleted",
      ticket: deleteTicket,
    });
  } else {
    return res.status(404).json({
      success: false,
      message: "ticket not found",
      ticket: deleteTicket,
    });
  }

};

const getTicketByUsername = (req, res) => {
  const username = req.params.username;
  const ticket = myDb.findByUsername(username);

  if (ticket) {
    return res.status(200).json({
      success: true,
      message: "ticket found",
      ticket: ticket,
    });
  } else {
    return res.status(404).json({
      success: false,
      message: "ticket not found",
      ticket: ticket,
    });
  }
};

const updateTicketByUsername = (req, res) => {
  const username = req.params.username;
  const updatedTickets = myDb.updateByUsername(username, req.body);

  // myDb.updateByUsername returns an array of updated tickets or a falsy value
  if (updatedTickets && Array.isArray(updatedTickets) && updatedTickets.length > 0) {
    return res.status(200).json({
      success: true,
      message: "ticket(s) updated",
      ticket: updatedTickets,
    });
  } else {
    return res.status(404).json({
      success: false,
      message: "ticket not found",
      ticket: updatedTickets || [],
    });
  }
};

const deleteTicketByUsername = (req, res) => {
    const username = req.params.username;
    const deleteTicket = myDb.deleteByUsername(username);

    if (deleteTicket) {
    return res.status(200).json({
      success: true,
      message: "ticket found",
      ticket: deleteTicket,
    });
  } else {
    return res.status(404).json({
      success: false,
      message: "ticket not found",
      ticket: deleteTicket,
    });
  }

};

const createTicket = (req, res) => {
  const { username, price } = req.body;

  const ticket = myDb.create(username, price);

  if (ticket) {
    return res.status(201).json({
      success: true,
      message: "ticket created",
      ticket: ticket,
    });
  } else {
    return res.status(404).json({
      success: false,
      message: "ticket could not created",
      ticket: ticket,
    });
  }
};

const createTicketBulk = (req, res) => {
  const { username, price, quantity } = req.body;

  const ticket = myDb.bulkCreate(username, price, quantity);

  if (ticket) {
    return res.status(201).json({
      success: true,
      message: " Bulk ticket created",
      ticket: ticket,
    });
  } else {
    return res.status(404).json({
      success: false,
      message: "Bulk ticket could not created",
      ticket: ticket,
    });
  }
};

const Draw = (req, res) => {
    // Validate query parameter and default to 1 winner when absent or invalid
    let winnerCount = parseInt(req.query.wc, 10);
    if (Number.isNaN(winnerCount) || winnerCount < 1) {
        winnerCount = 1;
    }

    const winners = myDb.draw(winnerCount);

    if (winners && Array.isArray(winners)) {
    return res.status(200).json({
      success: true,
      message: `got ${winners.length} winner(s)`,
      ticket: winners,
    });
  } else {
    return res.status(404).json({
      success: false,
      message: "could not get winner",
      ticket: winners,
    });
  }
};

const getAllTicket = (req, res) => {
    const allTicket = myDb.find()
     // Return 200 on success. myDb.find() returns an array (possibly empty).
     if (Array.isArray(allTicket)) {
    return res.status(200).json({
      success: true,
      message: "All ticket",
      ticket: allTicket,
    });
  } else {
    return res.status(500).json({
      success: false,
      message: "something went wrong",
      ticket: allTicket,
    });
  }

};

module.exports = {
    getTicketById,
    getAllTicket,
    getTicketByUsername,
    updateTicketById,
    updateTicketByUsername,
    deleteTicketById,
    deleteTicketByUsername,
    createTicket,
    createTicketBulk,
    Draw
}
