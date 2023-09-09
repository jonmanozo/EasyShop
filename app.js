const express = require('express')
const expressLayouts = require('express-ejs-layouts');

const app = express();

app.set('view engine', 'ejs');
app.set('layout', 'layouts/layout');

app.use(expressLayouts);
app.use(express.static('public'))

app.get('/', (req, res) =>{
    res.render('index')
})

app.listen(3000, () => {
    console.log(`Example app listening on port http://127.0.0.1:3000/`)
})