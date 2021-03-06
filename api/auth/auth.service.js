const bcrypt = require('bcrypt')
const userService = require('../user/user.service')
const db = require('../../data/user_db.json');
const fs = require('fs')

const saltRounds = 10
module.exports = {
    login
}

async function login(username, password) {
    if (!username || !password) return Promise.reject('username and password are required!')
    const user = await userService.getByUsername(username)
    if (!user) return Promise.reject('Invalid username or password')
    const match = await bcrypt.compare(password, user.password)
    if (!match) return Promise.reject('Invalid password')
    const users = db.map(_user => {
        if (_user.username === username) {
            _user.lastLoginAt = Date.now()
            _user.loginCount++
        }
        return _user
    })
    _saveToDB(users)
    return user;
}

function _saveToDB(users) {
    return new Promise((resolve, reject) => {
        fs.writeFile("data/user_db.json", JSON.stringify(users), (err) => {
            if (err) {
                return reject(err)
            }
            resolve()
        });
    })
}


