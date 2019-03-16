const path = require('path')
const express = require('express')
const nunjucks = require('nunjucks')

const app = express()

app.use(express.static(path.resolve(__dirname, './public')))

app.set('views', path.resolve(__dirname, './views'))
nunjucks.configure(path.resolve(__dirname, './views'), {
  autoescape: true,
  express: app
})
app.set('view engine', 'html')

app.get('/', function (req, res) {
  res.render('home/home.html',
    { a: 'ss' }
  )
})

module.exports = app
