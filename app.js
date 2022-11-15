require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const router = require('./api');
const client = require('./db/client');


client.connect();
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api', router);

module.exports = app;
// test
// testing again
// testing again again
//testing for rachael branch to see pull request
