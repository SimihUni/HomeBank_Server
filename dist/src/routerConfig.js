"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const authentications_1 = __importDefault(require("./Routes/authentications"));
const users_1 = __importDefault(require("./Routes/users"));
const transactions_1 = __importDefault(require("./Routes/transactions"));
const routerConf = express.Router();
routerConf.use("/auth", authentications_1.default);
routerConf.use("/txn", transactions_1.default);
routerConf.use("/user", users_1.default);
exports.default = routerConf;
