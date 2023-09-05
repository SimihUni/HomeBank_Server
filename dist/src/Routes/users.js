"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const enviroments_1 = require("../enviroments");
const userDB_1 = require("../database/userDB");
const users = express_1.default.Router();
users.get('/allusers', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`GET: ${enviroments_1.host}/user/allusers`);
    const all_users = yield (0, userDB_1.getAllUsers)();
    res.status(200).send(all_users.rows);
}));
users.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`GET: ${enviroments_1.host}/user/user`);
    if (req.query.email == undefined) {
        res.status(400).send('Bad request.');
    }
    const user = yield (0, userDB_1.getUser)(req.query.email);
    res.status(200).send(user.rows);
}));
users.patch('/username', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`PATCH: ${enviroments_1.host}/user/username`);
    if (req.body.email == undefined || req.body.new_username == undefined) {
        res.status(400).send('Bad request.');
    }
    res.status(501).send('Not implemented yet.');
}));
exports.default = users;
