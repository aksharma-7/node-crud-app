const express = require('express');
const path = require('path')


const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.get('/', (req, res) => {
    let articles = [
        {
            id: 1,
            title: 'Article One',
            author: 'Atul Sharma',
            body: 'This is article one'
        },
        {
            id: 2,
            title: 'Article two',
            author: 'Atul Sharma',
            body: 'This is article two'
        },
        {
            id: 3,
            title: 'Article three',
            author: 'Atul Sharma',
            body: 'This is article three'
        }
    ];
    res.render('index', {
        title: 'Articles',
        articles: articles
    })
});

app.get('/articles/add', (req, res) => {
    res.render('add_article', {
        title: 'Add Articles'
    })
})

app.listen(3000, () => {
    console.log('Server is running on 3000')
});