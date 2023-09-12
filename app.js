const express = require('express')
const expressLayouts = require('express-ejs-layouts');
const {router, productsDataArrayToObject} = require('./routes/product')
const axios = require('axios')

const Promise = require('promise');
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
              const data2 =  productsDataArrayToObject(featured);
      
              res.render('index', {data2, categories});
            
        });
        
     
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
              const data2 =  productsDataArrayToObject(featured);
      
              res.render('index', {data2, categories});
            
        });
        
     
     })
                        



    // axios.all(endpoints.map((endpoint) => axios.get(endpoint))).then(
    
    //     function (response) {
        
    //     const featured = []
        
    //     const products = response.data.products
    //     for (const product of products) {
            
    //         if(product.rating > 4.8){
    //             featured.push(product)
    //         }
    //     }
    //     const data =  productsDataArrayToObject(featured);

    // })
   



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