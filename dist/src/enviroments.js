"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.host = exports.port = void 0;
const port = 3000;
exports.port = port;
process.env.port = port.toString();
const host = "http://" + "localhost:" + process.env.port;
exports.host = host;
