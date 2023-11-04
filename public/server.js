const express = require('express')
const path = require('path')

const server = express();

server
  .disable('x-powered-by')
  .use(express.static(path.join(__dirname)))
  .get('/exam*', (req, res) => {
    res.sendFile(path.join(__dirname,"exam.html"))
  }).get("/*", (req,res)=> {
    console.log("request client")
    res.sendFile(path.join(__dirname,"index.html"))
  }).listen("3004");


