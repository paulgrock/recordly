const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const {MONGO_USERNAME, MONGO_PASSWORD} = process.env;

const pw = encodeURIComponent(MONGO_PASSWORD)
const url = `mongodb://${MONGO_USERNAME}:${pw}@ds145039.mlab.com:45039/recordly-tracks`;

exports.url = url;