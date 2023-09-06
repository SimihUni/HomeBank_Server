import express from "express";
import { host } from "../enviroments";
import { getTxnBYtime } from "../database/txnDB";

const txns = express.Router();

txns.get('/', async (req,res) => {
    console.log(`GET: ${host}/txn/`);
    const all_users = await getTxnBYtime(req.query.timestamp as string);
    res.status(200).send(all_users.rows);
});

txns.post('/', async (req,res) => {
    console.log(`POST: ${host}/txn/`);
    //TODO
    res.status(501).send('Not implemented yet.');
});

export default txns;