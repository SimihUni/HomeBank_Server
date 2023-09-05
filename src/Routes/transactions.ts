import express from "express";
import { host } from "../enviroments";

const txns = express.Router();

txns.get('/', async (req,res) => {
    console.log(`GET: ${host}/txn/`);
    //TODO
    res.status(501).send('Not implemented yet.');
});

txns.post('/', async (req,res) => {
    console.log(`POST: ${host}/txn/`);
    //TODO
    res.status(501).send('Not implemented yet.');
});

export default txns;