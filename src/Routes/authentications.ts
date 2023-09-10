import express from "express";
import { host } from "../enviroments";
import { checkPassword, createUser } from "../database/userDB";

const authN = express.Router();

authN.post('/login',async (req,res) => {
    console.log(`POST: ${host}/auth/login`);
    const result = await checkPassword(req.body.email,req.body.password);
    res.status(200).send(result);
});

authN.post('/refresh',async (req,res) => {
    console.log(`POST: ${host}/auth/refresh`);
    //TODO post refresh token for auth token
    res.status(501).send('Not implemented yet.');
});

//admin access??
authN.post('/register',async (req,res) => {
    console.log(`POST: ${host}/auth/register`);
    const result = await createUser(req.body.email,req.body.password,req.body.username,'client');
    res.status(200).send(result);
});

export default authN;