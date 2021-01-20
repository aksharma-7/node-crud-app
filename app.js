const express = require('express');
const path = require('path')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost/nodekb', { useNewUrlParser: true,useUnifiedTopology: true  });
let db = mongoose.connection;


//check connection
db.once('open', () => {
    console.log('Connected to mongodb')
})


// check for DB errors
db.on('error', (err) => {
    console.log(err);
})


// init app
const app = express();


//bring in models
let Article = require('./models/article');



//load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


//body parser middle ware
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());

// set public folder
app.use(express.static(path.join(__dirname, 'public')));

//Home route
app.get('/', (req, res) => {
    Article.find({}, (err, articles) => {
        if(err) {
            console.log(err);
        } else {
            res.render('index', {
                title: 'Articles',
                articles: articles
            });
        }
    });
});


// get single article
app.get('/article/:id', (req, res) => {
    Article.findById(req.params.id, (err, article) => {
        res.render('article', {
            article: article
        });
    });
});


// Add route
app.post('/articles/add', (req, res) => {
    let article = new Article();
    article.title = req.body.title;
    article.author = req.body.author,
    article.body = req.body.body

    article.save((err) => {
        if(err) {
            console.log(err);
            return;
        } else {
            res.redirect('/')
        }
    })
})

app.get('/articles/add', (req, res) => {
    res.render('add_article', {
        title: 'Add Articles'
    })
})


//start server
app.listen(3000, () => {
    console.log('Server is running on 3000')
});