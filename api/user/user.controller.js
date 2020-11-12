const userService = require('./user.service')

async function getUsers(req, res) {
    const users = await userService.query()
    res.send(users)
}
async function updateUser(req, res) {
    userService.updateUser(req.body)
}

module.exports = {
    getUsers,
    updateUser
};