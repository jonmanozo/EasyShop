const express = require('express')
const router = express.Router();
const bcrypt = require('bcrypt');

router.get('/', (req, res) => {
    
    if(req.session.user){
        console.log(req.session.user)
        res.redirect('/')
        return
    }
    
    res.render('login')
})


router.post('/', (req, res) => {

    const db = req.app.get('DB')
   
    const {email, password} = req.body

    const user = db.get('users').find({email : email}).value();
   
    if (user) {
        
        bcrypt.compare(password, user.password, (err, result) => {
            
            if(result){
        
                req.session.regenerate(function (err) {
                    
                    if(err) {
                        res.send('Something went wrong')
                    }
    
                    // dont include the password to the session 
                    const userInfo = {
                        id: user.id,
                        fName: user.fName,
                        lName: user.lName,
                        email: user.email              
                    }
    
                    req.session.user = userInfo
                    
                    req.session.save(function(err){

                        if(err) {
                            res.send('Something went wrong');
    
                        }
                        console.log(req.session.user)
                        res.redirect('/')
                    })
    
                })
            }
            else{
                // Password not match
                res.send('password not match')
            }
        })
        
    }else{
        // No email found 
        res.send('No email found')
        
    }

})


module.exports  = {router}