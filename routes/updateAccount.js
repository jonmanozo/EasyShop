const express = require('express')
const router = express.Router();
const bcrypt = require('bcrypt');

router.get('/', (req, res) => {

     res.render('Account_Settings', {userEmail: req.app.get('userEmail'), categories: req.app.get('categories')})
   
})


router.post('/', (req, res)=>{
    const db = req.app.get('DB')


})

module.exports  = { router }