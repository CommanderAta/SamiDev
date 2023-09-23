const express = require('express');
const mongoose = require('mongoose');

try {
     mongoose.connect("mongodb://127.0.0.1:27017/atta", {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("Connected to MongoDB");

    const db = mongoose.connection;
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }

