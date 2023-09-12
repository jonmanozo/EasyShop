const express = require('express')
const router = express.Router();
const bcrypt = require('bcrypt');

router.get('/', (req, res) => {
    res.render('signup')
})

router.post('/', (req, res)=>{

    const db = req.app.get('DB');

    const {FirstName, LastName, Email, password } = req.body;
    
    const email = db.get('users').find({email : Email}).value()

    
    if(!email){
        
        bcrypt.hash(password, 10, (err, hashPassword)=>{
            db.get('users').push(
                {
                    id: Date.now(),
                    fName: FirstName,
                    lName: LastName,
                    email : Email,
                    password: hashPassword
                }

                ).write()
            
            res.redirect('/login')
        })

    }else{
        res.send('email already exist')
    }

    
})


module.exports  = { router }