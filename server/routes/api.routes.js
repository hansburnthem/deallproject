const { Router, express } = require('express')
const helmet = require('helmet')

/**
 * @type {express.Router}
 */
const apiRoutes = new Router()

apiRoutes.use(helmet({
    hsts: false,
    contentSecurityPolicy: false
}))

// apiRoutes.get('/test', require('../controller/auth.controller'))
apiRoutes.post('/login', require('../controller/auth.controller').login)
apiRoutes.post('/logout', require('../controller/auth.controller').logout)
apiRoutes.post('/register', require('../controller/auth.controller').register)
apiRoutes.post('/refreshtoken', require('../controller/auth.controller').refresh)

apiRoutes.get('/users', [require('../middleware/auth.middleware'),require('../middleware/admin.middleware')],require('../controller/admin.controller').readAll)
apiRoutes.get('/user/:id', [require('../middleware/auth.middleware'),require('../middleware/admin.middleware')],require('../controller/admin.controller').readById)
apiRoutes.put('/user/:id', [require('../middleware/auth.middleware'),require('../middleware/admin.middleware')],require('../controller/admin.controller').update)
apiRoutes.delete('/user/:id', [require('../middleware/auth.middleware'),require('../middleware/admin.middleware')],require('../controller/admin.controller').delete)

apiRoutes.get('/profile', [require('../middleware/auth.middleware'),require('../middleware/user.middleware')],require('../controller/user.controller').read)




module.exports = apiRoutes