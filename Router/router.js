const express = require('express');
const mongodb = require('mongodb')
const router = express();
const User = require('../Database/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const secretKey = "secretkey"
const ccxt = require('ccxt');
const {basicget, getRecordfromName, basicRegister, updatebyName, deletebyID, login, signup, verifyToken, verify, fetchCryptoPrice} = require('../Controller/todo');

router.use(express.json());

//-----------------------------------------------------------------------------------------------------------

router.get('/', basicget);

router.get('/:name', getRecordfromName);

router.post("/register", basicRegister);

router.put('/:name', updatebyName);

router.delete("/:id", deletebyID);

router.post("/login", login)

router.post("/signup", signup)

router.post("/verify", verifyToken, verify)

router.get('/price', fetchCryptoPrice);


module.exports = router;