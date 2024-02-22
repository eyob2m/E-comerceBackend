const express = require("express")
const { createUser, logIn, getUsers, getaUser, deleteUser, updateUser } = require("../controller/userCtrl")
const router = express.Router()

router.post('/register', createUser)
router.post('/login', logIn)
router.get('/all-users', getUsers)
router.get('/:id', getaUser)
router.delete('/:id', deleteUser)
router.put('/:id', updateUser)
module.exports = router