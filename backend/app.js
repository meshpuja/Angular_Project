const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const postRoutes = require('./routes/posts')
const userRoutes =  require('./routes/user')
const path = require('path')

mongoose.connect("mongodb+srv://pooja:"+process.env.Mongo_Atlas_password+"@eventsdb.zscpt.mongodb.net/node-angular").then(() => {
  console.log('Connection to database successfully established')
}).catch(() => {
  console.log('Connection to database failed')
})
const app = express()
app.use((req, res, next) => {

  res.setHeader('Access-Control-Allow-Origin', "*")
  res.setHeader('Access-Control-Allow-Headers', 'Accept, Content-Type, Origin, X-Requested-With, Authorization')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  next()
})
//c0yqkmYwyMYO7Abw
app.use(bodyParser.json())
app.use('/api/posts',postRoutes)
app.use('/api/user',userRoutes)
app.use('/images',express.static(path.join('backend/images')))
module.exports = app
