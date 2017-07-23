const mongoose = require('mongoose');
require('dotenv').config();

mongoose.Promise = global.Promise;
const mongoUri = process.env.NODE_ENV === 'test' ? process.env.MONGOURI_TEST : process.env.MONGOURI_DEV
mongoose.connect(mongoUri, {useMongoClient: true})