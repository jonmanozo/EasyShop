const express = require('express')
const router = express.Router();
const axios = require('axios');
const {productsDataArrayToObject } = require('./product')


router.get('/', (req, res) =>{
    console.log(req.query)
    axios.get(`https://dummyjson.com/products/search?q=${req.query.q}`)
    .then(result =>{
        console.log(result.data.products)
    
        const data = productsDataArrayToObject(result.data.products)
        res.render('search', {userEmail: req.app.get('userEmail'), categories: req.app.get('categories'), products : data})
    
    })
})


module.exports = {
    router
}