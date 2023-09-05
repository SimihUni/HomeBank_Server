// main file for project

const http = require('http');
import routerConf from "./src/routerConfig";
import { port } from './src/enviroments';

// for HTTPS
//====================================================================
//const fs = require('fs');
//const https = require('https');
//const privateKey  = fs.readFileSync('sslcert/server.key', 'utf8');
//const certificate = fs.readFileSync('sslcert/server.crt', 'utf8');
//const credentials = {key: privateKey, cert: certificate};
//====================================================================

const express = require('express');
const app = express();

// your express configuration here
//==========================================

app.use("/", routerConf);

//==========================================

var httpServer = http.createServer(app);
httpServer.listen(port);
console.log(`Listening on port:${port}`);

//var httpsServer = https.createServer(credentials, app);
//httpsServer.listen(8443);