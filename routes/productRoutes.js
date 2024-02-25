const express = require("express")
// const { createUser, logIn, getUsers, getaUser, deleteUser, updateUser, blockUser, unblockUser, handleRefToken, logOut } = require("../controller/userCtrl")
const { authMiddleware, isAdmin } = require("../middlewares/authMiddlewares.js")
const { createProduct, getaProduct, getProducts, updateProduct, deleteProduct } = require("../controller/productCtrl.js")

const router = express.Router()

router.post('/',authMiddleware,isAdmin, createProduct)
router.get('/all-products', getProducts)
router.get('/:id', getaProduct)

// router.get('/refresh', handleRefToken)
// router.get('/logout' ,logOut)
// router.get('/:id' ,getaUser)
 router.delete('/:id',authMiddleware,isAdmin, deleteProduct)
router.put('/:id',authMiddleware,isAdmin,updateProduct)
// router.put('/block-user/:id',authMiddleware,isAdmin, blockUser)
// router.put('/unblock-user/:id',authMiddleware,isAdmin, unblockUser)

module.exports = router