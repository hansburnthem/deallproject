const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const logger = require('./logger/Logger')
// const path = require('path')
// const fs = require('fs')

const app = express()
const PORT = process.env.PORT || 8080

app.use(express.json())
app.use(cors())

app.use(morgan("combined", { "stream": logger.stream }))

app.use(require('./routes/api.routes'))

app.listen(PORT, console.log(`Server is running on http://localhost:${PORT}`))