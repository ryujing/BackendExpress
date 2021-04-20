const express = require('express')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const redis = require('redis')
const mysql = require('mysql')
const connection = mysql.createConnection({
  host: 'mysql',
  user: 'root',
  password: 'root',
  database: 'movie_db',
  port: '3306'
})
const redisStore = require('connect-redis')(session)
const redisClient = redis.createClient({
    host: 'redis',
    port: 6379,
});

const app = express()

// Simple API KEY check
const apiKeyCheck = function(req, res, next) {
    const apiKey = req.headers['x-api-key']
    if (apiKey != 'Quoo3ahvo6jiivaeKaep9aQuei8ceabi') {
        res.status(401).json({ message: 'Could not get Apikey' })
    } else {
        next()
    }
}

// Session Store
app.use(session({
    secret: 'secret',
    store: new redisStore({
        client: redisClient
    }),
    cookie: { httpOnly: true, secure: false, maxage: 1000 * 60 * 30 }
}))

app.get('/', function(req, res) {  
    res.json({})
})

// GET favorites Routing
app.get('/favorites', (req, res) => {
    let movies
    if (req.session.movies) {
        movies = req.session.movies
        console.log("Session movies:" + movies)
        connection.connect(function(err) {
            if (err) throw err
            let sql = 'SELECT id, movie_title FROM movies WHERE id IN (' +  movies + ')'
            console.log("SQL:" + sql)
            connection.query(sql, function (err, result, fields) {
                if (err) throw err
                res.json(result)
            })
        })
    } else {
        res.json({ message: "Not Favorites." })
    }
})

// POST favorite/:id Routing
app.post('/favorite/:id', (req, res) => {
    let addParam = req.params.id
    let movies
    if (req.session.movies) {
        movies = req.session.movies + ',' + addParam
    } else {
        movies = req.params.id
    }
    console.log("ADD Param:" + addParam)
    req.session.movies = movies
    res.json({ message: "Set Favorites..."})
})

// Check apikey when favorite
app.use(apiKeyCheck)

// GET movies Routing
app.get('/movies', (req, res) => {
    let search = req.query.search

    connection.connect(function(err) {
        if (err) throw err
        let sql = 'SELECT id, movie_title  FROM movies'
        if (search) {
            console.log('QUERY:' + decodeURIComponent(search))
            sql = sql + ' WHERE '
                + 'movie_title LIKE "%' + decodeURIComponent(search)  + '%" OR '
                + 'movie_description LIKE "%' + decodeURIComponent(search)  + '%"'
        }

        connection.query(sql, function (err, result, fields) {  
            if (err) throw err
            res.json(result)
	})
    })
})

// GET movie/:id Routing
app.get('/movie/:id', (req, res) => {
    let search = req.params.id

    connection.connect(function(err) {
        if (err) throw err
        let sql = 'SELECT * FROM movies WHERE id = ' + search
        connection.query(sql, function (err, result, fields) {
            if (err) throw err
            res.json(result)
        })
    })
})

// Undefined path is 404
app.use(function(req, res) {
    res.status(404).json({ message: "404 Not Found" })
})

var server = app.listen(3000, function(){
    console.log("Node.js is listening to PORT:" + server.address().port)
})
