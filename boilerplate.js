// I made this script to automate the process of creating a boilerplate for a basic CRUD app using
// Node, Express, Mongoose etc. It will create the basic directories and files needed to get you
// started. It will also create a basic data schema/model mimicing a blogpost/application.
// Feel free to edit to suit your needs. It will also create basic restful CRUD routes in the app.js 
// file.
// Please go through the app.js file and edit as needed. 

const fs = require('fs');
const folderName = process.argv[2] || 'Project';

const appJsData = `const express          = require('express'),
      methodOverride   = require('method-override'),
      expressSanitizer = require('express-sanitizer'),
      app              = express(),
      mongoose         = require('mongoose'),
      bodyParser       = require('body-parser'),
      request          = require('request');
     

//   APP CONFIG
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
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

// MONGOOSE CONFIG
const SchemaName = new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created:{type:Date,default:Date.now}
})

let ModelName = mongoose.model('ModelName',SchemaName);

// ModelName.create({
//     title:"Test Blog",
//     image:"https://images.pexels.com/photos/261662/pexels-photo-261662.jpeg?auto=compress&cs=tinysrgb&h=350",
//     body: "I'm baby pBR&B stumptown woke, drinking vinegar ethical iPhone retro meggings tousled raw denim skateboard you probably haven't heard of them sriracha. Hella tousled drinking vinegar normcore kitsch copper mug chicharrones hoodie man braid yuccie shabby chic before they sold out slow-carb truffaut." 
    
// },function(err,post){
//     if(err){
//         console.log(err)
//     }else{
//         console.log('Post Added');
//         console.log(post)
//     }
// })

// RESTFUL ROUTES

// LANDING PAGE
app.get('/',function(req,res){
    res.redirect('/blogs');
})

// INDEX ROUTE
app.get('/blogs',function(req,res){
    let blogposts = Blogpost.find({},function(err,allposts){
        if(err){
            console.log(err)
        } else {res.render('index',{blogposts:allposts});
    }
    })
    
})

// NEW ROUTE
app.get('/blogs/new',function(req,res){
    res.render('new');
})

// CREATE ROUTE 
app.post('/blogs',function(req,res){
    let data = req.body.blog;
    data.body = req.sanitize(data.body); 
    ModelName.create(data,function(err,blog){
        if(err){
            console.log(err)
        }else{
            res.redirect('/blogs');
        }
    })
   
})

// SHOW ROUTE 

app.get('/blogs/:id',function(req,res){
    ModelName.findById(req.params.id,function(err,foundBlog){
        if (err){
            console.log(err)
            res.redirect('/blogs')
        } else {
            res.render('show',{blog:foundBlog});
        }
    })
    
})


// EDIT ROUTE
app.get('/blogs/:id/edit',function(req,res){
    ModelName.findById(req.params.id,function(err,foundBlog){
        if (err) {
            console.log(err)
            res.redirect('/blogs')
        } else{
            res.render('edit',{blog:foundBlog});
        }
    })
    
})


// UPDATE ROUTE

app.put('/blogs/:id',function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body); 
    ModelName.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
        if(err){
            console.log(err);
            res.redirect('/blogs');
        } else {
            res.redirect('/blogs/'+req.params.id);
        }
    })
    
    
})

// DELETE ROUTE
app.delete('/blogs/:id',function(req,res){
    ModelName.findByIdAndRemove(req.params.id,function(err){
        if (err){
            console.log(err);
            res.send('SOMETHING WENT WRONG');
        } else{
            res.redirect('/blogs');
        }
    })
})


app.listen(3000,function(){
    console.log('App Server Started!');
})
`;


const packageJSONData = `{
    "dependencies": {
        "body-parser": "^1.19.0",
        "ejs": "^3.1.5",
        "express": "^4.17.1",
        "express-sanitizer": "^1.0.5",
        "method-override": "^3.0.0",
        "mongoose": "^5.11.10",
        "request": "^2.88.2"
    }
}
`;

const ejsIncludeData = `<%- include('partials/header') %>

<%- include('partials/footer') %>
`;



try {
    fs.mkdirSync(folderName);
    fs.mkdirSync(`${folderName}/public`);
    fs.mkdirSync(`${folderName}/public/img`);
    fs.mkdirSync(`${folderName}/public/screenshots`);
    fs.mkdirSync(`${folderName}/public/scripts`);
    fs.mkdirSync(`${folderName}/public/styles`);
    fs.mkdirSync(`${folderName}/public/styles/css`);
    fs.mkdirSync(`${folderName}/public/styles/fonts`);
    fs.mkdirSync(`${folderName}/views`);
    fs.mkdirSync(`${folderName}/views/partials`);

    fs.writeFileSync(`${folderName}/app.js`, appJsData);
    fs.writeFileSync(`${folderName}/package.json`, packageJSONData);
    fs.writeFileSync(`${folderName}/views/index.ejs`, ejsIncludeData);
    fs.writeFileSync(`${folderName}/views/new.ejs`, ejsIncludeData);
    fs.writeFileSync(`${folderName}/views/show.ejs`, ejsIncludeData);
    fs.writeFileSync(`${folderName}/views/edit.ejs`, ejsIncludeData);
    fs.writeFileSync(`${folderName}/views/partials/header.ejs`, '');
    fs.writeFileSync(`${folderName}/views/partials/footer.ejs`, '');
    fs.writeFileSync(`${folderName}/public/styles/css/app.css`, '');
} catch (error) {
    console.log(error);
}

