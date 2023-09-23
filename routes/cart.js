const express = require('express')
const router = express.Router();
const axios = require('axios');
const Promise = require('promise');

router.get('/', (req, res) => {
    const db = req.app.get('DB')

    const carts = db.get('carts').find({cartId: 1695368561049}).get('cart').value()
    const productRequest = []
    
    for (const product of carts) {
        productRequest.push(axios.get(`https://dummyjson.com/products/${product.productId}`))
    }
    
    Promise.all(productRequest).then(function (result){
        
        
        result.forEach((val, index) =>{
            console.log(val.data)
        })
    
        
        console.log('Done')
    })

    
    res.render('cart')
})

router.post('/', (req, res) => {
    
    if(!req.session.user)
    {
        res.json({code: -1, message: 'Please Sign-in'})
        return
    }

    const db = req.app.get('DB')
    
    const user = db.get('users').find({email: req.body.email}).value()

    const carts = db.get('carts').find({cartId: user.id}).value()

    if(carts){
        
        const data = {
            productId: req.body.prodId,
            productPrice: req.body.prodPrice,
            productQty: req.body.prodQty,
            productTotal: req.body.prodTotal
        }

        const productsId = db.get('carts').find({cartId: user.id}).get('cart').map('productId').value()

        if(!productsId.includes(data.productId)){
            db.get('carts').find({cartId: user.id}).get('cart').push(data).write()
            
            const cartItemCount = getCartCount(req.app, req.session.user)
            console.log(cartItemCount)
            res.json({code: 1, message: 'Success', cartItemCount: cartItemCount, user: req.session.user})
           
            return
        }else{
            res.json({code: 2, message: 'This product already exist'})
            return
        }
    }
    
    
    
    
})

function getCartCount(app, usr){

    const db = app.get('DB')
    
    let cartCount = 0;
            
    if(usr){            
        const user = db.get('users').find({email : usr.email}).value()
                    
        if(user){
            const carts = db.get('carts').find({cartId: user.id}).value()
                            
            cartCount = carts ? db.get('carts').find({cartId: user.id}).get('cart').size().value() : 0;
        }
                
    }

    return cartCount
}

module.exports = { router , getCartCount}



