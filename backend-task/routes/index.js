const express = require('express')
const router = express.Router()

const postRoutes = require('./postRouter')

router.use('/post', postRoutes);


module.exports = router
