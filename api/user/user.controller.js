const userService = require('./user.service')

async function getUsers(req, res) {
    const users = await userService.query()
    res.send(users)

}
async function getUser(req, res) {
    const userId = req.params.id
    const user = await userService.query(userId)
    res.send(user)
}
async function addUser(req, res) {
    const user = await userService.add(req.body)
    res.send(user)
}
async function updateUser(req, res) {
    await userService.update(req.body)
    res.send('updated successfully')
}


module.exports = {
    getUsers,
    getUser,
    addUser,
    updateUser
};