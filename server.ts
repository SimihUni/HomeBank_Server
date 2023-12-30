// main file for project

import routerConf from './src/routerConfig'
import { port } from './src/enviroments'
import { createServer } from 'http'
import express from 'express'

// for HTTPS
//= ===================================================================
// const fs = require('fs');
// const https = require('https');
// const privateKey  = fs.readFileSync('sslcert/server.key', 'utf8');
// const certificate = fs.readFileSync('sslcert/server.crt', 'utf8');
// const credentials = {key: privateKey, cert: certificate};
//= ===================================================================


const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// your express configuration here
//= =========================================

app.use('/', routerConf)

//= =========================================

const httpServer = createServer(app)
httpServer.listen(port)
console.log(`Listening on port:${port}`)

// var httpsServer = https.createServer(credentials, app);
// httpsServer.listen(8443);
