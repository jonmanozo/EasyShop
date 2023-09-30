const express = require('express')
const router = express.Router();
const axios = require('axios');
const Promise = require('promise');

const SHIPPING = 150


router.get('/', (req, res) => {
    if(!req.session.user){
        res.redirect('/login')
        return
    }

    res.render('cart', {categories : req.app.get('categories'), userEmail: req.app.get('userEmail')})
})

router.get('/all', (req, res) =>{
    if (!req.session.user){
        res.json('Please login')
    }
    const db = req.app.get('DB')
    
    const user =  db.get('users').find({email: req.session.user.email}).value()
    
    if(!user){
        res.json({message: 'No user found!'})
        return
    }
    
    const carts = db.get('carts').find({cartId: user.id}).get('cart').value()
    
    if(carts.length <= 0){
        res.json({})
    }


    const productRequest = []
    
    for (const product of carts) {
        productRequest.push(axios.get(`https://dummyjson.com/products/${product.productId}`))
    }
    
    Promise.all(productRequest).then(function (result){
        const products = []
        let totalAmount = 0; 
        
        result.forEach((val, index) =>{
            const price = val.data.price
            const qty = carts[index].productQty
            const total = qty * price
            // console.log(carts[index].productQty)
            //console.log(val.data.title) // val.data.title, val.data.thumbnail, val.data.price
            products.push({
                id : val.data.id,
                title : val.data.title,
                img : val.data.thumbnail,
                price: price,
                qty: qty, 
                total: total, 
            })      
            totalAmount += total
        })

        res.json(products)
    })

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
        //TODO: remove price later
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
            //console.log(cartItemCount)
            res.json({code: 1, message: 'Success', cartItemCount: cartItemCount, user: req.session.user})
           
            return
        }else{
            res.json({code: 2, message: 'This product already exist'})
            return
        }
    }
    
})

router.delete('/', (req, res) =>{
    const db = req.app.get('DB')
    
    const userID = db.get('users').find({email: req.session.user.email}).value().id

    const product = db.get('carts').find({cartId: userID}).get('cart').find({productId : Number(req.body.productId)}).value()

    db.get('carts').find({cartId: userID}).get('cart').remove(product).write().then(() =>{
        console.log('deleted')
        res.json({statusCode: 200})
    }

    )
})

router.get('/checkout', (req, res) =>{
    
})

router.post('/checkout', (req, res) =>{
    
    if(!req.session.user){
        res.redirect('/login')
    }
    console.log(req.session.cart)
    
    const productId = req.session.cart.id
    const productQty = req.session.cart.qty

    

    if(!Array.isArray(productId)){
        
        axios.get(`https://dummyjson.com/products/${productId}`).then(result => {
            console.log(result.data)
            const price = result.data.price
            const total = price * Number(productQty)
            //save total to session
            const product = {
                qty : productQty,
                title : result.data.title,
                total : total
            }

            const totals = {
                order : total,
                shipping : SHIPPING,
                totalAmount : total + SHIPPING
            }

            res.render('checkout', {categories : req.app.get('categories'), userEmail: req.app.get('userEmail'), products : product, totals : totals })

        })
    
    }else{
       
        const endpoint = []
        
        productId.forEach((item, index) =>{
           endpoint[index] = axios.get(`https://dummyjson.com/products/${item}`)
        })
        
        Promise.all(endpoint).then((result) =>{
            
            const products =[]
            
            let total = 0

            result.forEach((product, index) =>{
                
                const price = product.data.price
                
                const qty = Number(productQty[index])
                
                amount = price * qty

                total += amount 
                
                products[index] = {
                    qty : qty,
                    title : product.data.title,
                    total : amount
                }
            })

            let totalObj = {
                order : total,
                shipping : 150,
                totalAmount : total + SHIPPING
            }

            res.render('checkout', {categories : req.app.get('categories'), userEmail: req.app.get('userEmail'), products : products, totals : totalObj})
        })
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


