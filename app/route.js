const router = require('express').Router()




router.use('/api/v1/ticket', require('../routes/ticket.route'))

router.get('/health', function( _req, res){

    res.status(200).send({})
})

module.exports = router