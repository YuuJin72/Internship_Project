require('dotenv').config();

// express 
const express = require('express');
const app = express();

  
app.get('/', function (req, res) {
  res.send('Hello World!');
});
  
const server = app.listen(8080, function () {
    const port = server.address().port;
  
  console.log('Server is working : PORT - ',port);
});

app.get('/test', function (req, res) {
    res.send('EXPRESS TEST');
  });

// mysql
const mysql      = require('mysql');
const connection = mysql.createConnection({
  host     : process.env.HOST,
  user     : process.env.USER,
  password : process.env.PASSWORD,
  database : process.env.DATABASE,
  port     : process.env.PORT
});

connection.connect(); 

connection.end();