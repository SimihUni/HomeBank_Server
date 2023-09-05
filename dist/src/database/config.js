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
exports.getClient = exports.pool = void 0;
const pg_1 = require("pg");
exports.pool = new pg_1.Pool({
    host: "localhost",
    port: 5432,
    max: 20,
    database: "homebank",
    user: "homebank",
    password: "password",
    application_name: "HomeBank Server",
});
// export const query = async (text: string | QueryConfig<any>, params: any) => {
//   const start = Date.now();
//   const res = await pool.query(text, params);
//   const duration = Date.now() - start;
//   console.log("executed query", { text, duration, rows: res.rowCount });
//   return res;
// };
const getClient = () => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield exports.pool.connect();
    const query = client.query;
    const release = client.release;
    const queries = { lastQuery: {} };
    // set a timeout of 5 seconds, after which we will log this client's last query
    const timeout = setTimeout(() => {
        console.error("A client has been checked out for more than 5 seconds!");
        console.error(`The last executed query on this client was: ${queries.lastQuery}`);
    }, 5000);
    // monkey patch the query method to keep track of the last query executed
    // @ts-ignore
    client.query = (...args) => __awaiter(void 0, void 0, void 0, function* () {
        queries.lastQuery = args;
        const start = Date.now();
        const res = yield query.apply(client, 
        // @ts-ignore
        args);
        const duration = Date.now() - start;
        // @ts-ignore
        console.log("executed query", { text: args[0], duration, rows: res.rowCount });
        return res;
    });
    client.release = () => {
        // clear our timeout
        clearTimeout(timeout);
        // set the methods back to their old un-monkey-patched version
        client.query = query;
        client.release = release;
        return release.apply(client);
    };
    return client;
});
exports.getClient = getClient;
