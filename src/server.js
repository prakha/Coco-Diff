import express from 'express';
import { AppReturnMiddleware, ssrAppReturn } from './utils/ssrApp';
const cookiesMiddleware = require('universal-cookie-express');

const server = express();
server.use(cookiesMiddleware())
server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  //  .use(express.static(process.env.NODE_ENV === "production" ? __dirname+"/public" : process.env.RAZZLE_PUBLIC_DIR))
  .get('/*', (req, res) => {
    // console.log(req.url)
    AppReturnMiddleware(req, res)
  });


export default server;
