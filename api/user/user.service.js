const db = require('../../user_db.json');

async function query(userId) {
    try {
        return db
    } catch (err) {
        console.log('Error, cannot find user/s', err)
        throw err
    }
}


async function update(user) {
    const collection = await db.getCollection('user')
    try {
        let savedUser = await query(user._id);
        savedUser = { ...savedUser, ...user };
        await collection.updateOne({ "_id": ObjectId(user._id) }, { $set: { ...savedUser, _id: ObjectId(user._id) } })
        return user
    } catch (err) {
        console.log('Error, cannot update user', err)
        throw err
    }
}

async function getByUsername(username) {
    try {
        const user = db.find(user => user.username === username)
        console.log('user?', username)
        return user;
    } catch (err) {
        console.log('Error, cannot find user', err)
        throw err
    }
}
module.exports = {
    query,
    update,
    getByUsername
}

