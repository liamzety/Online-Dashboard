const express = require('express')
const { getUsers, getUser, addUser, updateUser } = require('./user.controller')
const router = express.Router()

router.get('/', getUsers)
router.get('/:id', getUser)
router.post('/', addUser)
router.put('/:id', updateUser)


module.exports = router

