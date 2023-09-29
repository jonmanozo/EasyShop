const express = require('express')
const router = express.Router();
const bcrypt = require('bcrypt');
const app = express();
router.get('/', (req, res) => {
        
    const db = req.app.get('DB');
    const LogEmail = req.session.userEmail;
    const email = db.get('users').find({email : LogEmail}).value()
    const userFName  = email.fName  
    const userLName = email.lName



    res.render('Account_Settings', {
        userEmail: LogEmail, 
        categories: req.app.get('categories'),
        FName: userFName,
        LName: userLName
    })
   
})

router.post('/ChangePassword', (req, res)=>{
    const db = req.app.get('DB')
        const {OldPassword, RepeatPass, NewPassword} = req.body;
        
        const LogEmail = req.session.userEmail;
        const userData = db.get('users').find({email : LogEmail}).value()
        const DataEmail  = userData.email  
        const userFName  = userData.fName  
        const userLName  = userData.lName  
        const DataPassword  = userData.password  

        bcrypt.compare(OldPassword, DataPassword, (err, result) => {
                        // if password is match
            if(result){
                
                if(NewPassword === RepeatPass){
                    bcrypt.hash(NewPassword, 10, (err, hashPassword)=>{
                       db.get('users').find({email: DataEmail}).assign({password: hashPassword}).write();
                    res.render('Account_Settings', {
                        userEmail: req.app.get('userEmail'), 
                        categories: req.app.get('categories'),
                        FName: userFName,
                        LName: userLName,
                        alertChangePass: `<div class="AlertMessageSuccess" >
                                                <i class="bi bi-check-circle-fill"></i>
                                                <p>Password Successfully Updated</p>
                                            </div>`

                     })
                  })
                }else{
                    res.render('Account_Settings', {
                        userEmail: req.app.get('userEmail'), 
                        categories: req.app.get('categories'),
                        FName: userFName,
                        LName: userLName,
                        alertChangePass: ` <div class="AlertMessage" >
                                                <i class="bi bi-exclamation-octagon-fill"></i>
                                                <p>New Password  And Repeat Password Do not matched!</p>
                                            </div>`
                    })
                }
                // const updateEmail = db.get('users').find({email: DataEmail}).assign({email: ChangeEmail}).write();
                // if(updateEmail){
                //     app.set('userEmail', DataEmail)
                //     renderEmail = req.app.get('userEmail')
                //     renderCategory = req.app.get('categories')
                // }
            }else{
                res.render('Account_Settings', {
                    userEmail: LogEmail, 
                    categories: req.app.get('categories'),
                    FName: userFName,
                    LName: userLName,
                    alertChangePass: ` <div class="AlertMessage" >
                                            <i class="bi bi-exclamation-octagon-fill"></i>
                                            <p>Incorrect Old Password</p>
                                       </div>`

                })
               
            }
        })
                    

})


router.post('/ChangeEmail', (req, res)=>{
    const db = req.app.get('DB')
    const LogEmail = req.session.userEmail;

    const {ChangeEmail, Password} = req.body;
    const EmailExist = db.get('users').find({email : ChangeEmail}).value()

    const userData = db.get('users').find({email : LogEmail}).value()

    const DataEmail  = userData.email  
    const userFName  = userData.fName  
    const userLName  = userData.lName  
    const DataPassword  = userData.password  
        
    //Check Email if exist
     if (EmailExist){
        res.render('Account_Settings', {  
            userEmail: DataEmail, 
            categories: req.app.get('categories'),
            FName: userFName,
            LName: userLName,
            
            UpdateEmailAlert: ` <div class="AlertMessage" >
                                    <i class="bi bi-exclamation-octagon-fill"></i>
                                    <p>Email Already Exist</p>
                                </div>`

        })
     }else{
        bcrypt.compare(Password, DataPassword, (err, result) => {
            // if password is match
            if(result){
                //Update Email
                const updateEmail = db.get('users').find({email: DataEmail}).assign({email: ChangeEmail}).write();
                if(updateEmail){
                    req.session.userEmail = ChangeEmail;

                    res.render('Account_Settings', {
                        userEmail: req.session.userEmail, 
                        categories: req.app.get('categories'),
                        FName: userFName,
                        LName: userLName,
                        UpdateEmailAlert: ` <div class="AlertMessageSuccess" >
                                                <i class="bi bi-check-circle-fill"></i>
                                                <p>Email Successfully updated. </p>
                                            </div> `});
                }else{
                    res.render();
                }
                
            }else{
                res.render('Account_Settings', {
                    userEmail: DataEmail, 
                    categories: req.app.get('categories'),
                    FName: userFName,
                    LName: userLName,
                    UpdateEmailAlert: ` <div class="AlertMessage" >
                                                <i class="bi bi-exclamation-octagon-fill">
                                                </i><p>Incorrect Password</p>
                                        </div>`



                })
            }
        })
     }
})

module.exports  = { router }