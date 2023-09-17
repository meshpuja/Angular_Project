const express = require('express')
const router = express.Router()
const controller =  require('../controllers/posts')

const checkAuth = require('../middleware/check_auth')
const extractFile = require('../middleware/file')


router.post('', checkAuth, extractFile, controller.createpost)
router.put('/:id', checkAuth,extractFile,controller.updatePost )
router.get('', controller.getPosts)

router.get("/:id",controller.getPost )
router.delete("/:id", checkAuth,controller.deletePost )

module.exports = router
