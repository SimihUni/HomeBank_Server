import express from "express";
import { host } from "../enviroments";
import { getAllUsers, getUser } from "../database/userDB";

const users = express.Router();

users.get('/allusers', async (req,res) => {
    console.log(`GET: ${host}/user/allusers`);
    const all_users = await getAllUsers();
    res.status(200).send(all_users.rows);
});

users.get('/',async (req,res) => {
    console.log(`GET: ${host}/user/user`);
    if(req.query.email == undefined) {
        res.status(400).send('Bad request.');
    }
    const user = await getUser(req.query.email as string);
    res.status(200).send(user.rows);
});

users.patch('/username', async (req,res) => {
    console.log(`PATCH: ${host}/user/username`);
    if(req.body.email == undefined || req.body.new_username == undefined) {
        res.status(400).send('Bad request.');
    }
    
    res.status(501).send('Not implemented yet.');
});

export default users;