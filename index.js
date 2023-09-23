const express = require('express');
const mongoose = require('mongoose');
require("./Database/connect")
const app = express();
const bcrypt = require('bcrypt');
const router = require('./Router/router');
const ccxt = require('ccxt');

app.use('/', router);



app.listen(3000, () => {
  console.log("Server started on port 3000");
});

