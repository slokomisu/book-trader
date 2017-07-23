const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const _ = require('lodash');
const jwt = require('express-jwt');
const jwtSign = require('jsonwebtoken');
const passport = require('./config/passport');
const router = require('./routes');
require('dotenv').config()


const cors = require('cors');
const app = express();
passport(app);

const users = [
  {
    id: 1,
    name: 'jonathanmh',
    password: '%2yx4'
  },
  {
    id: 2,
    name: 'test',
    password: 'test'
  }
];








app.use(cors());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
mongoose.Promise = global.Promise;
const mongoUri = process.env.NODE_ENV === 'test' ? process.env.MONGOURI_TEST : process.env.MONGOURI_DEV
mongoose.connect(mongoUri, {useMongoClient: true})

app.use('/api/', router);

app.listen(3000)

module.exports = app;


