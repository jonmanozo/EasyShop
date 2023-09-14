const express = require('express')
const router = express.Router();
const axios = require('axios');

router.get('/allproducts', (req, res) =>{
    
    const LIMIT = 20;

    const PAGE = req.query.page ? (LIMIT * parseInt(req.query.page)) - LIMIT : 0

    axios.get(`https://dummyjson.com/products?limit=${LIMIT}&skip=${PAGE}`)
    
    .then(function (response) {
        
        const products = response.data.products;
        
        if(products.length <= 0) res.sendStatus(404)
        
        const data = productsDataArrayToObject(products)
        res.sendStatus(200)
        
    })



    
})

router.get('/products/:id', (req, res) => {
    
    axios.get(`https://dummyjson.com/products/${req.params.id}`)
    
    .then(function (response) {
        
        const product = response.data;
        const data = singleProductObject(product)
        res.send(req.params.id)
        // res.render('productInfoS', {product: data} )
    }).catch((err) =>{
        res.sendStatus(err.response.status)
    
    })
})

function singleProductObject(p){
    return {
        id: p.id,
        title: p.title,
        desc: p.description,
        price: p.price,
        rating: p.rating,
        stock: p.stock,
        brand: p.brand,
        imgs : p.images
    }
}





function productsDataArrayToObject(products){
    
    const arr = []
    
    for (const product of products) {
       
        const productInfo = {
            id: product.id,
            title: product.title,
            price: product.price,
            rating: product.rating,
            cat: product.category,
            stock: product.stock,
            image: product.thumbnail
        }
        
        arr.push(productInfo)
    }
    return arr;
}
    




module.exports = {router,  productsDataArrayToObject}