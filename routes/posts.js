const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.send('Posts PAGE')
})

//export to router
module.exports = router