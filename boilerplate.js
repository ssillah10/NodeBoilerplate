// I made this script to automate the process of creating a boilerplate for a basic CRUD app using
// Node, Express, Mongoose etc. It will create the basic directories and files needed to get you
// started. It will also create a basic data schema/model mimicing a product/application.
// Feel free to edit to suit your needs. It will also create basic restful CRUD routes in the index.js 
// file.
// Please go through the app.js file and edit as needed. 

const fs = require('fs');
const folderName = process.argv[2] || 'Project';

const indexJsData = `const express          = require('express'),
      methodOverride   = require('method-override'),
      expressSanitizer = require('express-sanitizer'),
      app              = express(),
      mongoose         = require('mongoose'),
      Product = require('./models/product'),
      request          = require('request'),
      path             = require('path');
     

//   APP CONFIG
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.use(expressSanitizer());
app.use(methodOverride('_method'));
app.set('view engine','ejs');

    //   DB SETUP
mongoose.connect('mongodb://localhost:27017/db_name',{
    useUnifiedTopology:true,
    useNewUrlParser: true
})
.then(() => console.log('Connected to the DB'))
.catch(err => console.log(err));


// RESTFUL ROUTES

// LANDING PAGE
app.get('/', function (req, res) {
    res.redirect('/products');
})

// INDEX ROUTE
app.get('/products', async (req, res) => {
   
        const products = await Product.find({})
        res.render('products/index', { products });
    
    

})

// NEW ROUTE
app.get('/products/new', (req, res) => {
    res.render('products/new', { categories });
})

// CREATE ROUTE
app.post('/products', async (req, res) => {
    const p = new Product(req.body);
    await p.save();
    res.redirect('/products');

})

// SHOW ROUTE

app.get('/products/:id', async (req, res) => {
    const { id } = req.params
    const product = await Product.findById(id);

    res.render('products/show', { product });
})


// EDIT ROUTE
app.get('/products/:id/edit', async (req, res) => {
    const { id } = req.params
    const product = await Product.findById(id)
    res.render('products/edit', { product, categories });
})




// UPDATE ROUTE

app.put('/products/:id', async (req, res) => {
    const { id } = req.params
    await Product.findByIdAndUpdate(id, req.body, { runValidators: true, new: true })
    res.redirect('/products / $ {id}'); //replace with a template literal
})

// DELETE ROUTE
app.delete('/products/:id', async (req, res) => {
    const { id } = req.params
    await Product.findByIdAndDelete(id)
    res.redirect('/products');
})



app.listen(3000,function(){
    console.log('App Server Started!');
})
`;


const packageJSONData = `{
    "dependencies": {
        "ejs": "^3.1.5",
        "express": "^4.17.1",
        "express-sanitizer": "^1.0.5",
        "method-override": "^3.0.0",
        "mongoose": "^5.11.10",
        "request": "^2.88.2"
    }
}
`;

const ejsIncludeData = `<%- include('../partials/header') %>

<%- include('../partials/footer') %>
`;

const productModelData = `const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        lowercase: true,
        enum: ['fruit', 'vegetable', 'dairy']
    }
    
})

let Product = mongoose.model('Product', productSchema);

module.exports = Product;`;

const seedData = `const mongoose = require('mongoose');
const Product = require('./models/product');

mongoose.connect('mongodb://localhost:27017/db_name', {
    useUnifiedTopology: true,
    useNewUrlParser: true
})
    .then(() => console.log('Connected to the DB'))
    .catch(err => console.log(err));


const seedProducts = [
    {
        name: 'Orange',
        price: 1.20,
        category: 'fruit'
    },
    {
        name: 'Organic Goddess Melon',
        price: 4.99,
        category: 'fruit'
    },
    {
        name: 'Organic Mini Seedless Watermelon',
        price: 3.99,
        category: 'fruit'
    },
    {
        name: 'Milk',
        price: 2.50,
        category: 'dairy'
    },
    {
        name: 'Chocolate Whole Milk',
        price: 3.50,
        category: 'dairy'
    },
    {
        name: 'Cheese',
        price: 1.99,
        category: 'dairy'
    },
    {
        name: 'Cucumber',
        price: 2.00,
        category: 'vegetable'
    },
    {
        name: 'Carrot',
        price: 0.99,
        category: 'vegetable'
    }
]

Product.insertMany(seedProducts)
    .then(m => {
        console.log(m)
    })
    .catch(err => {
        console.log(err)
    });`



try {
    fs.mkdirSync(folderName);
    fs.mkdirSync(`${folderName}/models`);
    fs.mkdirSync(`${folderName}/public`);
    fs.mkdirSync(`${folderName}/public/img`);
    fs.mkdirSync(`${folderName}/public/screenshots`);
    fs.mkdirSync(`${folderName}/public/scripts`);
    fs.mkdirSync(`${folderName}/public/styles`);
    fs.mkdirSync(`${folderName}/public/styles/css`);
    fs.mkdirSync(`${folderName}/public/styles/fonts`);
    fs.mkdirSync(`${folderName}/views`);
    fs.mkdirSync(`${folderName}/views/partials`);
    fs.mkdirSync(`${folderName}/views/products`);

    fs.writeFileSync(`${folderName}/index.js`, indexJsData);
    fs.writeFileSync(`${folderName}/models/product.js`, productModelData);
    fs.writeFileSync(`${folderName}/package.json`, packageJSONData);
    fs.writeFileSync(`${folderName}/seeds.js`, seedData);
    fs.writeFileSync(`${folderName}/views/products/index.ejs`, ejsIncludeData);
    fs.writeFileSync(`${folderName}/views/products/new.ejs`, ejsIncludeData);
    fs.writeFileSync(`${folderName}/views/products/show.ejs`, ejsIncludeData);
    fs.writeFileSync(`${folderName}/views/products/edit.ejs`, ejsIncludeData);
    fs.writeFileSync(`${folderName}/views/partials/header.ejs`, '');
    fs.writeFileSync(`${folderName}/views/partials/footer.ejs`, '');
    fs.writeFileSync(`${folderName}/public/styles/css/app.css`, '');
} catch (error) {
    console.log(error);
}

