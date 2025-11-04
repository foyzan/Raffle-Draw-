const { getTicketById, updateTicketById, deleteTicketById, getTicketByUsername, updateTicketByUsername, deleteTicketByUsername, createTicket, createTicketBulk, Draw, getAllTicket } = require('../controller/ticket.controller');

const router = require('express').Router()

router.get('/t/:ticketId', getTicketById);

router.patch('/t/:ticketId', updateTicketById);

router.delete('/t/:ticketId', deleteTicketById);


router.get('/u/:username', getTicketByUsername);

router.patch('/u/:username', updateTicketByUsername);

router.delete('/u/:username', deleteTicketByUsername);


router.post('/sell', createTicket);

router.post('/bulk', createTicketBulk);

router.get('/draw', Draw);

router.get('', getAllTicket);

module.exports = router