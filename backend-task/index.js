const express = require('express')
const app = express()
const port = 5000
const cors = require('cors')
const cookieParser = require('cookie-parser')
const routes = require('./routes/index')

//setting up cros
app.use(cors({ credentials: true, origin: true }))
//cookie parser
app.use(cookieParser())
// Json parser
app.use(express.json())

app.use('/', routes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// Please have a look on help.txt file before procceding i will take few sec. it will help a lot :)