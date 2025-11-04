const express = require('express')
const middleware = require('./middleware')
const app = express()
const {notFoundHandler, errorHandler} = require('./error')

// `middleware` is an array of middleware functions — spread it so Express registers them correctly
app.use(...middleware)
app.use(require('./route'))

app.use(notFoundHandler);
app.use(errorHandler)
module.exports = app
