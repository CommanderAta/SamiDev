const express = require('express');
const mongodb = require('mongodb');
const User = require("../Database/User");
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const secretKey = "secretkey"


async function basicget(req,resp) {
    await require('../Database/connect');
    const data = await User.find({});
    resp.send(data)
}

async function getRecordfromName(req, resp) {
    await require('../Database/connect');
    console.log("Searching for name:", req.params.name);  // Debugging
    let result = await User.findOne({ name: req.params.name });
    if (result) {
        console.log("Record found:", result);  // Debugging
        resp.send(result);
    } else {
        console.log("Record not found for name:", req.params.name);  // Debugging
        resp.send("Record not Found");
    }
}

async function basicRegister(req, resp) {
    try {
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Create a new user with the hashed password
        let user = new User({
            ...req.body,
            password: hashedPassword
        });

        // Save the user to the database
        let result = await user.save();
        resp.send(result);
    } catch (error) {
        if (error.code === 11000) { // this is the error code for duplicate key
            resp.status(400).send('Username or email already exists');
        } else {
            resp.status(500).send('Some error occurred');
        }
    }
}

async function updatebyName(req,resp) {
    
    await require('../Database/connect');
    let result = await User.updateOne(
        {
            name: req.params.name
        }
        ,
        {
            $set: req.body
        }
    );
    console.log(result);
}

async function deletebyID(req,resp) {
    
    console.log(req.params.id)
    await require('../Database/connect');
    const result = User.deleteOne({ _id: new mongodb.ObjectId(req.params.id) })
    resp.send("done")

}

async function login(req, resp) {
    await require('../Database/connect');
  
    if (req.body.password && req.body.email) {
        let user = await User.findOne({ email: req.body.email });
  
        if (user) {
            const validPassword = await bcrypt.compare(req.body.password, user.password);
  
            if (validPassword) {
                // Generate a token
                const token = jwt.sign({ _id: user._id }, 'yourSecretKey', { expiresIn: '1h' });
                
                // Remove password from the response
                user.password = undefined;

                // Send token and user data
                resp.send({ token, user });
            } else {
                resp.status(400).send({ result: 'Invalid password' });
            }
        } else {
            resp.status(400).send({ result: 'No user found' });
        }
    } else {
        resp.status(400).send({ result: 'Email and password are required' });
    }
}
async function signup(req,resp){

    const user ={
        id: 1,
        username: "anil",
        email: "abc@test.com"
    }
    
    
    jwt.sign({user}, secretKey, { expiresIn: '300s' }, (err, token) => {    
        resp.json({
            token
        })
    })

}

async function verify(req,resp){

    jwt.verify(req.token, secretKey, (err, authData) => {
        if(err) {
            resp.send({result: "invalid token"})
        }
        else{
            resp.json({
                message: "Profile Accessed",
                authData
            })
        }
    })

}

function verifyToken(req, resp, next){

    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader!== 'undefined'){
        const bearer = bearerHeader.split(" ");
        const token = bearer[1];
        req.token = token;
        next()
    }

}

async function fetchCryptoPrice() {
    try {
        const exchange = new ccxt.binance();  // Use Binance exchange
        const market = 'BTC/USDT';  // ENG to BTC market
  
        // const ticker = await exchange.fetchTicker(market);
        
        // const date = new Date(ticker.timestamp);

        console.log({
            exchange: 'Binance',
            // market,
            // lastPrice: ticker['last'],
            // timestamp: date.toISOString(),
        });
    } catch (error) {
        console.error('Error fetching price:', error);
    }
  }


module.exports = {basicget , getRecordfromName, basicRegister, updatebyName, deletebyID, login, signup, verifyToken, verify, fetchCryptoPrice};

