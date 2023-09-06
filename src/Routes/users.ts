import express from "express";
import { host } from "../enviroments";
import { getAllUsers, getUser } from "../database/userDB";
import { getAccountBYbeneficiary } from "../database/account";

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
    //TODO
    res.status(501).send('Not implemented yet.');
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
    res.status(501).send('Not implemented yet.');
});

users.get('/account', async (req,res) => {
    console.log(`GET: ${host}/user/account`);
    const all_users = await getAccountBYbeneficiary(req.body.beneficiary as string);
    res.status(200).send(all_users.rows);
});

users.post('/account', async (req,res) => {
    console.log(`POST: ${host}/user/account`);
    //TODO create account
    //create iban
    res.status(501).send('Not implemented yet.');
});

users.delete('/account', async (req,res) => {
    console.log(`DELETE: ${host}/user/account`);
    //TODO
    res.status(501).send('Not implemented yet.');
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