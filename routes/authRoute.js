const express = require("express")
const { createUser, logIn, getUsers, getaUser, deleteUser, updateUser, blockUser, unblockUser } = require("../controller/userCtrl")
const { authMiddleware, isAdmin } = require("../middlewares/authMiddlewares")

const router = express.Router()

router.post('/register', createUser)
router.post('/login', logIn)
router.get('/all-users', getUsers)
router.get('/:id' ,getaUser)
router.delete('/:id', deleteUser)
router.put('/edit-user',authMiddleware,isAdmin, updateUser)
router.put('/block-user/:id',authMiddleware,isAdmin, blockUser)
router.put('/unblock-user/:id',authMiddleware,isAdmin, unblockUser)
module.exports = router