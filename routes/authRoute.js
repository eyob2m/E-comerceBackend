const express = require("express")
const { createUser, logIn } = require("../controller/userCtrl")
const router = express.Router()

router.post('/register', createUser)
router.post('/login', logIn)

module.exports = router