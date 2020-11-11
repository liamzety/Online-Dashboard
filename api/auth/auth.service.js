const bcrypt = require('bcrypt')
const userService = require('../user/user.service')
const fs = require('fs')
const db = require('../../user_db.json');

const saltRounds = 10
module.exports = {
    signup,
    login,
}

async function login(username, password) {
    console.log(`auth.service - login with username: ${username}`)
    if (!username || !password) return Promise.reject('username and password are required!')

    const user = await userService.getByUsername(username)
    console.log('user:', user)
    if (!user) return Promise.reject('Invalid username or password')
    const match = await bcrypt.compare(password, user.password)
    if (!match) return Promise.reject('Invalid password')

    delete user.password;
    return user;
}
// 

async function signup(username, password) {
    if (!username || !password) return Promise.reject('username and password are required!')
    const hash = await bcrypt.hash(password, saltRounds)
    const user = {
        username,
        password: hash
    }
    const users = [
        ...db,
        user
    ]
    // _saveToDb(users)
    console.log('user:', user)
    return user
}

// function _saveToDb(users) {
//     fs.writeFileSync("../../user_db.json", JSON.stringify(users), (err) => {
//         if (err) console.log('err', err)
//         console.log('file saved')
//     });
// }