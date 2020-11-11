const express = require('express')
const { getUsers } = require('./user.controller')
const router = express.Router()

router.get('/', getUsers)

module.exports = router

