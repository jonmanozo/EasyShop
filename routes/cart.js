const express = require('express')
const router = express.Router();


router.get('/', (req, res) => {
    // return nothing if no user
    res.send('OK')
    //Render cart
})

router.post('/', (req, res) => {
    console.log(req.body)
})


module.exports = { router }



