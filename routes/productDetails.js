
const express = require('express');
const router = express.Router();
const axios = require('axios');
const { productsDataArrayToObject } = require('./product');



router.get('/productDetails/:id', (req, res) => {
    const productId = req.params.id;

    
    axios.get(`https://dummyjson.com/products/${productId}`)
        .then(response => {
            const product = response.data;
            
            res.render('product_details', { product });
        })
        .catch(error => {
            console.error('Error fetching product productDetails:', error);
            res.sendStatus(500); 
        });
});




module.exports = router;
