# Lottery API

-  sell lottery ticket 
-  update lottery ticket
-  delete lottery ticket
-  get all ticket
-  get ticket by id
-  bulk buy (get multiple ticket at once)
-  raffle draw


# Model

-  Ticket:
      -number(uniqueID)
      -username
      -price
      -timestamp


# Route

- /ticket/t/:ticketId - GET find by Id
- /ticket/t/:ticketId - PATCH update by Id
- /ticket/t/:ticketId - DELETE DELETE by Id

- /ticket/u/:username - GET find all ticket of given username
- /ticket/u/:username - PATCH update all ticket of given username
- /ticket/u/:username - DELETE remove all ticket of given username

- /ticket/sell - POST create ticket
- /ticket/bulk - POST create many ticket at once
- /ticket/draw
- /ticket - GET find all ticket