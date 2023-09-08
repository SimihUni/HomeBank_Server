import express from "express";
import { host } from "../enviroments";
import { checkPassword } from "../database/userDB";

const authN = express.Router();

authN.post('/login',async (req,res) => {
    console.log(`POST: ${host}/auth/login`);
    const result = await checkPassword(req.body.email,req.body.password);
    res.status(200).send(result)
});

authN.post('/refresh',async (req,res) => {
    console.log(`POST: ${host}/auth/refresh`);
    //TODO post refresh token for auth token
    res.status(501).send('Not implemented yet.');
});

//admin access??
authN.post('/register',async (req,res) => {
    console.log(`POST: ${host}/auth/register`);
    //TODO post credentials for new user, then 
    res.status(501).send('Not implemented yet.');
});

export default authN;