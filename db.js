const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_USER = process.env.MONGO_USER || 'user';
const MONGO_PASS = process.env.MONGO_PASS || 'pass';
const MONGO_HOST = process.env.MONGO_HOST || 'host';
const MONGO_SRV = (process.env.MONGO_SRV ? '+srv' : '');

const mongoUrl = `mongodb${MONGO_SRV}://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}/?retryWrites=true&w=majority`;
const connect = mongoose.connect(mongoUrl);

connect.then((db) => {
    //console.log("Connected!");
}, (err) => { 
    console.log(err); 
});

