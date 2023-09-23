const express = require('express')
const router = express.Router();
const bcrypt = require('bcrypt');

router.get('/', (req, res) => {
    res.render('signup')
})

router.post('/', (req, res)=>{

    const db = req.app.get('DB');

    const {FirstName, LastName, Email, password, RepeatPass } = req.body;
    
    const email = db.get('users').find({email : Email}).value()
    
    //Check Input Password if math with Confirm Password
    if (RepeatPass === password){  
                if(!email){
                    
                    bcrypt.hash(password, 10, (err, hashPassword)=>{
                        const ID = Date.now()
                        db.get('users').push(
                            {
                                id: ID,
                                fName: FirstName,
                                lName: LastName,
                                email : Email,
                                password: hashPassword
                            }
                            ).write().then(() =>{
                                db.get('carts').push(
                                    {
                                        cartId : ID,
                                        cart : []
                                    }
                                ).write()
                            })
                        
                        const SignUpAlert  = `
                        <script>
                            $(document).ready(function(){
                                $("#myModal").modal('show');
                            });
                        </script>`
                        res.render('signup', {SignUpAlert})
                    })

                }else{
                    res.render('signup', {alert: `<div class="alert alert-danger" role="alert">Email already exist!</div>`});
                }
    }else{

        res.render('signup', {alert: `<div class="alert alert-danger" role="alert">Confirm Password  do not matched!</div>`});

    }

    
})


module.exports  = { router }