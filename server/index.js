const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const helmet = require('helmet')
const winston = require('winston')

const app = express()
const PORT = process.env.PORT || 8080

app.use(cors({
    origin: ['*']
}))
app.use(morgan('dev'))

/**
 * @type {express.Router}
 */
 const apiRoutes = new Router()

 apiRoutes.use(helmet({
    hsts: false,
    contentSecurityPolicy: false
}))

apiRoutes.post('/login', require('./controller/auth.controller'))
apiRoutes.post('/logout', require('./controller/auth.controller'))
apiRoutes.post('/register', require('./controller/auth.controller'))

app.use(apiRoutes)

app.listen(PORT, console.log(`Server is running on http://localhost:${PORT}`))