const express = require('express')
const expressLayouts = require('express-ejs-layouts');
const {router, productsDataArrayToObject} = require('./routes/product')
const axios = require('axios')
const Promise = require('promise');
const app = express();
const loginRoute = require('./routes/login')
const signUpRoute = require('./routes/signup')
const bodyParser = require('body-parser')
const session = require('express-session');


const low = require('lowdb')
const FileAsync = require('lowdb/adapters/FileAsync')
const adapter = new FileAsync('db.json')

app.set('view engine', 'ejs');
app.set('layout', 'layouts/layout');

app.use(expressLayouts);
app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}))

app.get('/', (req, res) => {
    
    let endpoints = [
        'https://dummyjson.com/products?limit=0',
        'https://dummyjson.com/products/categories'
    ];
    
    // axios.all(endpoints.map((endpoint) => axios.get(endpoint))).then(
    // ({data: products}) => {
    Promise.all(endpoints.map((endpoint) => axios.get(endpoint))).then(([{data: products}, {data: categories}] )=> {
        
        
        
        const featured = []
        for (const product of products.products) {
            if(product.rating > 4.8){
                featured.push(product)
            }
        }
        
        const userEmail = req.session.userEmail;
        const data2 =  productsDataArrayToObject(featured);
        res.render('index', {data2, categories, userEmail});
 
    });
    
    
})

app.get('/about', (req, res)=>{
    res.send("About")
})


//____________________________PRODUCT DISPLAY PER CATEGORY___________________________

function PerProductCategoryPage (){
    let endpoints = [
        'https://dummyjson.com/products?limit=0',
        'https://dummyjson.com/products/categories'
    ];
    Promise.all(endpoints.map((endpoint) => axios.get(endpoint))).then(([{data: products}, {data: categories}] )=> {
        
        
        
        for (const category of categories) {
            
            app.get('/'+category,(req, res)=>{
                
                const ProductPerCategory = []
                for (const product of products.products) {
                    
                    if(product.category === category){
                        ProductPerCategory.push(product)
                    }
                }
                
                const data2 =  productsDataArrayToObject(ProductPerCategory);
                res.render('product_per_category', {data2,categories,category});
                
                
            })
        }
        
        
    })
}

PerProductCategoryPage();

app.use('/products', router)
app.use('/login', loginRoute.router )
app.use('/signup', signUpRoute.router)

app.get('/logout', (req, res) => {
    req.session.destroy(function(err) {
        
        res.redirect('/')
    })
})



low(adapter).then(function (db) {
    db.defaults({users : [], carts : []}).write()
    app.set('DB', db)
}).then(function (){
    app.listen(3000, () => {
        console.log(`Example app listening on port http://127.0.0.1:3000/`)
    })
    
})