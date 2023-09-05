"use strict";
// main file for project
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http = require('http');
const routerConfig_1 = __importDefault(require("./src/routerConfig"));
const enviroments_1 = require("./src/enviroments");
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
app.use("/", routerConfig_1.default);
//==========================================
var httpServer = http.createServer(app);
httpServer.listen(enviroments_1.port);
console.log(`Listening on port:${enviroments_1.port}`);
//var httpsServer = https.createServer(credentials, app);
//httpsServer.listen(8443);
