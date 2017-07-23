const express = require('express');
const bodyParser = require('body-parser');
const passport = require('./config/passport');
const router = require('./routes');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
require('dotenv').config();
require('./config/mongoose');

const app = express();

app.use(helmet());
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('common'));
} else {
  app.use(morgan('dev'));
}
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());
passport(app);

app.use('/api/', router);

app.listen(process.env.PORT || 3005);

module.exports = app;
