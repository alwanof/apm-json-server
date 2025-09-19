// See https://github.com/typicode/json-server#module
const crypto = require('crypto')
const jsonServer = require('json-server')

const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

server.use(middlewares)
server.use(jsonServer.bodyParser)
server.use(
    jsonServer.rewriter({
        '/api/*': '/$1',
        '/blog/:resource/:id/show': '/:resource/:id'
    })
)

const verifyLogin = (req, res) => {
    const { username, password } = req.body || {}

    if (!username || !password) {
        return res
            .status(400)
            .json({ error: 'Username and password are required to login' })
    }

    if (!router.db.has('users').value()) {
        return res.status(500).json({ error: 'User store is not configured' })
    }

    const user = router.db.get('users').find({ username }).value()

    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' })
    }

    const passwordHash = crypto.createHash('md5').update(password).digest('hex')

    if (passwordHash !== user.passwordHash) {
        return res.status(401).json({ error: 'Invalid credentials' })
    }

    return res.json({ message: 'Login successful' })
}

server.post('/login', verifyLogin)

server.use(router)
server.listen(3000, () => {
    console.log('JSON Server is running')
})

// Export the Server API
module.exports = server
