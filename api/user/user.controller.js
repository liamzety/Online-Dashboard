const userService = require('./user.service')

async function getUsers(req, res) {
    const users = await userService.query()
    res.send(users)
}

module.exports = {
    getUsers
};