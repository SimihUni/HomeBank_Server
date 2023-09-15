import express from "express";
import { host } from "../enviroments";
import { checkPassword, createUser } from "../database/userDB";

const authN = express.Router();

authN.post("/login", async (req, res) => {
  console.log(`POST: ${host}/auth/login`);
  if (req.body?.email === undefined || req.body?.password === undefined) {
    res.status(400).send("Bad request.");
    return;
  }
  try {
    const result = await checkPassword(req.body.email, req.body.password);
    if (result.rowCount == 0) {
      //no such users
      res.status(400).send("Bad credentials.");
      return;
    }
    if (result.rows[0].pswmatch) {
      // pass match yes

      //TODO send refresh and auth tokens
      res.status(202).send("Login successfull.");
      return;
    } else {
      // pass match no
      res.status(400).send("Bad credentials.");
      return;
    }
    res.status(200).send(result);
  } catch (error) {
    console.error("Middleware layer, error notification:", error);
    res.status(500).send("Internal server error.");
  }
});

authN.post("/refresh", async (req, res) => {
  console.log(`POST: ${host}/auth/refresh`);
  //TODO post refresh token for auth token
  res.status(501).send("Not implemented yet.");
});

//admin access??
authN.post("/register", async (req, res) => {
  console.log(`POST: ${host}/auth/register`);
  if (
    req.body?.email === undefined ||
    req.body?.password === undefined ||
    req.body?.username === undefined
  ) {
    res.status(400).send("Bad request.");
    return;
  }
  try {
    const result = await createUser(
      req.body.email,
      req.body.password,
      req.body.username,
      "client"
    );
    if (result.rowCount == 1) {
      res.status(201).send("User created.");
    } else {
      //rowCount should be 0 if email is not found
      res.status(404).send("Not found.");
    }
  } catch (error) {
    console.error("Middleware layer, error notification:", error);
    res.status(500).send("Internal server error.");
  }
});

export default authN;
