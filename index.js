require("babel-polyfill")
require("babel-register")

const app  = require("./src/app").default
const port = process.env.PORT || 3000

console.log(`Booting app to listen on port ${port}`)

module.exports = app.listen(port)
