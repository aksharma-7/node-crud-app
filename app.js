const express = require('express');
const path = require('path')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');


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


// Express Session Middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
}));

//Express Messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Express Validator Middleware
app.use(expressValidator({
    errorFormatter: (param, msg, value) => {
        var namespace = param.split('.'),
        root = namespace.shift(),
        formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }

        return {
            param: formParam,
            msg: msg,
            value: value
        }
    }
}))


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


//Route files
let articles = require('./routes/articles');
let users = require('./routes/users');
app.use('/articles', articles);
app.use('/users', users);


//start server
app.listen(3000, () => {
    console.log('Server is running on 3000')
});