const express = require('express');
const path = require('path')
const mongoose = require('mongoose');
const e = require('express');

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
let Article = require('./models/article')


//load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


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

app.get('/articles/add', (req, res) => {
    res.render('add_article', {
        title: 'Add Articles'
    })
})


//start server
app.listen(3000, () => {
    console.log('Server is running on 3000')
});