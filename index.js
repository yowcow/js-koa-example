require("babel-polyfill")
require("babel-register")

const createApp = require("./src/app").default
const port      = process.env.PORT || 3000

createApp().then(app => {
  console.log(`Booting app to listen on port ${port}`)
  app.listen(port)
})
