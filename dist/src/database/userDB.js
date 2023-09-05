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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = exports.getAllUsers = void 0;
const config_1 = require("./config");
function getAllUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        const client = yield (0, config_1.getClient)();
        const text = "SELECT (email, username, role) FROM users";
        try {
            const query_res = yield client.query(text);
            console.log("All users:");
            query_res.rows.map((row) => console.log(row));
            client.release();
            return query_res;
        }
        catch (error) {
            console.error("Error while trying to query! Error:", error);
            client.release();
            throw error;
        }
    });
}
exports.getAllUsers = getAllUsers;
function getUser(email) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = yield (0, config_1.getClient)();
        const text = "SELECT (email, username, role) FROM users WHERE email=$1";
        const values = [email];
        try {
            const query_res = yield client.query(text, values);
            console.log(`User with email ${email} :`);
            query_res.rows.map((row) => console.log(row));
            client.release();
            return query_res;
        }
        catch (error) {
            console.error("Error while trying to query! Error:", error);
            client.release();
            throw error;
        }
    });
}
exports.getUser = getUser;
