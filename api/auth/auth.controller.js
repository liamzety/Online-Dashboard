const authService = require('./auth.service')

async function login(req, res) {
    const { username, password } = req.body
    console.log('LOGIN!', username, password)
    try {
        const user = await authService.login(username, password)
        req.session.user = user;
        res.json(user)
    } catch (err) {
        res.status(401).send({ error: err })
    }
}

async function signup(req, res) {
    try {
        const { username, password } = req.body
        const user = await authService.signup(username, password)
        req.session.user = user
        res.json(user)
    } catch (err) {
        res.status(500).send({ error: 'could not signup, please try later' })
    }
}

async function logout(req, res) {
    try {
        req.session.destroy()
        res.send({ message: 'logged out successfully' })
    } catch (err) {
        res.status(500).send({ error: err })
    }
}

module.exports = {
    login,
    signup,
    logout
}