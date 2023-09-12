const express = require('express')
const expressLayouts = require('express-ejs-layouts');
const {router, productsDataArrayToObject} = require('./routes/product')
const axios = require('axios')

const app = express();

app.set('view engine', 'ejs');
app.set('layout', 'layouts/layout');

app.use(expressLayouts);
app.use(express.static('public'))

app.get('/signup', (req, res) =>{
    res.render('signup')
})

app.get('/about', (req, res)=>{
    res.send("About")
})


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
        const data =  productsDataArrayToObject(featured);
                        
        res.render('index', {data});

    })
   

        
})

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
        const data =  productsDataArrayToObject(featured);
                        
        res.render('index', {data});

    })
   

        
})



app.get('/login', (req, res) => {
    
    axios.get('https://dummyjson.com/products/categories')
    .then(function (response) {
        



            const categories = response.data
            

            // for (const category of category ){
            //     categoryArr.push(category)
            // }
            console.log(categories[1]);
            // const CategoryData = categoryValueDataArrayToObject(category);
                            



            res.render('login', {categories});
    
        })

        
});


app.use('/products', router)


app.listen(3000, () => {
    console.log(`Example app listening on port http://127.0.0.1:3000/`)
})