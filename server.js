require('dotenv').config()
const app = require("./app/app");

// default to 8080 when PORT is not provided
const PORT = process.env.PORT || 8080

app.listen(PORT, function(){
    console.log('App is running on port ' + PORT)
})