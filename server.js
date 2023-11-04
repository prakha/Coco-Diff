const express = require('express')
const path = require('path')

const server = express();

server
  .disable('x-powered-by')
  .use(express.static(path.join(__dirname,"build","public")))
  .get('/exam*', (req, res) => {
    res.sendFile(path.join(__dirname,"build","public","exam.html"))
  })
  .get('/?dr*', (req, res) => {
    res.sendFile(path.join(__dirname,"build","public","extra.html"))
  })
  .get("/*", (req,res)=> {
    console.log("request client")
    res.sendFile(path.join(__dirname,"build","public","index.html"))
  }).listen("3004");


