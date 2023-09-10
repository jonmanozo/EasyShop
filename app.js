const express = require('express')
const expressLayouts = require('express-ejs-layouts');
const {router, productsDataArrayToObject} = require('./routes/product')
const axios = require('axios')

const app = express();

app.set('view engine', 'ejs');
app.set('layout', 'layouts/layout');

app.use(expressLayouts);
app.use(express.static('public'))



app.get('/', (req, res) => {
    
    axios.get('https://dummyjson.com/products?limit=0')
    .then(function (response) {
        
        const featured = []
        
        const products = response.data.products
        
        for (const product of products) {
            
            if(product.rating > 4.8){
                featured.push(product)
            }
        }

        res.send(productsDataArrayToObject(featured))


    })
})


app.use('/products', router)


app.listen(3000, () => {
    console.log(`Example app listening on port http://127.0.0.1:3000/`)
})