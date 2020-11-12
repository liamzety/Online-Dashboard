const db = require('../../data/user_db.json');
const fs = require('fs')

async function query(userId) {
    try {
        return db
    } catch (err) {
        console.log('Error, cannot find user/s', err)
        throw err
    }
}


async function updateUser(user) {
    if (!user.id) return
    try {
        const userIdx = db.findIndex(_user => {
            return _user.id === user.id
        })
        const users = db
        users[userIdx] = { ...users[userIdx], ...user }
        _saveToDB(users)
    } catch (err) {
        console.log('Error, cannot update user', err)
        throw err
    }
}

async function getByUsername(username) {
    try {
        const user = db.find(user => user.username === username)
        return user;
    } catch (err) {
        console.log('Error, cannot find user', err)
        throw err
    }
}
module.exports = {
    query,
    updateUser,
    getByUsername
}

function _saveToDB(users) {
    return new Promise((resolve, reject) => {
        fs.writeFile("data/user_db.json", JSON.stringify(users), (err) => {
            if (err) {
                console.log('err?', err)
                return reject(err)
            }
            resolve()
        });
    })
}

