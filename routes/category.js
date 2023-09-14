const express = require('express')
const router = express.Router();
const axios = require('axios')
const {productsDataArrayToObject} = require('../routes/product')

router.get('/:catName', (req, res)=>{
    
    const cat = req.app.get('categories')
    
    //https://dummyjson.com/products/category/smartphones
    axios.get(`https://dummyjson.com/products/category/${req.params.catName}`)
    .then(function(response) {
        // console.log()
        const productsResult = response.data.products;

        const products = productsDataArrayToObject(productsResult)
        console.log(cat)
        res.render('product_per_category', {products: products, categories: cat, category: req.params.catName})

    })
    
    
   
})



module.exports = {router}