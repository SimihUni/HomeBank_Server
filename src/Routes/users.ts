import express from "express";
import { host } from "../enviroments";
import { deleteUser, getAllUsers, getUser } from "../database/userDB";
import { createAccount, deleteAccount, getAccountBYbeneficiary } from "../database/account";
import { randomInt, randomUUID } from "crypto";
import { getTxnBYfrom_iban, getTxnBYto_iban } from "../database/txnDB";

const users = express.Router();


//admin access
users.get('/all', async (req,res) => {
    console.log(`GET: ${host}/user/all`);
    const all_users = await getAllUsers();
    res.status(200).send(all_users.rows);
});

users.get('/',async (req,res) => {
    console.log(`GET: ${host}/user/`);
    if(req.query.email == undefined) {
        res.status(400).send('Bad request.');
    }
    const user = await getUser(req.query.email as string);
    res.status(200).send(user.rows);
});

users.delete('/', async (req,res) => {
    console.log(`DELETE: ${host}/user/`);
    const user = await deleteUser(req.query.email as string);
    res.status(200).send(user.rows);
});

users.patch('/username', async (req,res) => {
    console.log(`PATCH: ${host}/user/username`);
    if(req.body.email == undefined || req.body.new_username == undefined) {
        res.status(400).send('Bad request.');
    }
    //TODO change username
    res.status(501).send('Not implemented yet.');
});

users.get('/balance', async (req,res) => {
    console.log(`GET: ${host}/user/balance`);
    //TODO get balance of an account or user
    const input = await getTxnBYto_iban(req.body.iban);
    const output = await getTxnBYfrom_iban(req.body.iban);
    res.status(200).send({ input: input.rows, output: output.rows});
});

users.get('/account', async (req,res) => {
    console.log(`GET: ${host}/user/account`);
    const all_users = await getAccountBYbeneficiary(req.body.beneficiary as string);
    res.status(200).send(all_users.rows);
});

users.post('/account', async (req,res) => {
    console.log(`POST: ${host}/user/account`);
    const iban = 'BG' + '28' + 'MONI' + randomInt(10000000000000,99999999999999);
    const result = await createAccount(req.body.beneficiary,iban);
    res.status(200).send(result);
});

users.delete('/account', async (req,res) => {
    console.log(`DELETE: ${host}/user/account`);
    const result = await deleteAccount(req.body.iban as string);
    res.status(200).send(result);
});

users.patch('/forgotten', async (req,res) => {
    console.log(`PATCH: ${host}/user/forgotten`);
    //TODO change password
    res.status(501).send('Not implemented yet.');
});

users.patch('/role', async (req,res) => {
    console.log(`PATCH: ${host}/user/role`);
    //TODO change role
    res.status(501).send('Not implemented yet.');
});

export default users;