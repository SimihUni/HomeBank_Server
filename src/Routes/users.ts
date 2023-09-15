import express from "express";
import { host } from "../enviroments";
import {
  changePassword,
  changeRole,
  changeUsername,
  deleteUser,
  getAllUsers,
  getUser,
} from "../database/userDB";
import {
  createAccount,
  deleteAccount,
  getAccountBYbeneficiary,
} from "../database/account";
import { randomInt, randomUUID } from "crypto";
import {
  getCurrentBalance,
  getTxnBYfrom_iban,
  getTxnBYto_iban,
} from "../database/txnDB";

const users = express.Router();

//admin access
users.get("/all", async (req, res) => {
  console.log(`GET: ${host}/user/all`);
  try {
    const all_users = await getAllUsers();
    res.status(200).send(all_users.rows);
  } catch (error) {
    console.error("Middleware layer, error notification:", error);
    res.status(500).send("Internal server error");
  }
});

users.get("/", async (req, res) => {
  console.log(`GET: ${host}/user/`);
  console.log(req.body);
  if (req.body?.email === undefined) {
    res.status(400).send("Bad request.");
    return;
  }
  try {
    const user = await getUser(req.body.email as string);
    res.status(200).send(user.rows);
  } catch (error) {
    console.error("Middleware layer, error notification:", error);
    res.status(500).send("Internal server error");
  }
});

users.delete("/", async (req, res) => {
  console.log(`DELETE: ${host}/user/`);
  if (req.body.email == undefined) {
    res.status(400).send("Bad request.");
    return;
  }
  try {
    //TODO Check if all account of this user are with zero balance

    const user = await deleteUser(req.body.email as string);
    res.status(200).send(user);
  } catch (error) {
    console.error("Middleware layer, error notification:", error);
    res.status(500).send("Internal server error");
  }
});

users.patch("/username", async (req, res) => {
  console.log(`PATCH: ${host}/user/username`);
  if (req.body.email == undefined || req.body.new_username == undefined) {
    res.status(400).send("Bad request.");
    return;
  }
  try {
    const result = await changeUsername(
      req.body.email as string,
      req.body.new_username as string
    );
    res.status(200).send(result);
  } catch (error) {
    console.error("Middleware layer, error notification:", error);
    res.status(500).send("Internal server error");
  }
});

users.get("/balance", async (req, res) => {
  console.log(`GET: ${host}/user/balance`);
  if (req.body.iban == undefined) {
    res.status(400).send("Bad request.");
    return;
  }
  try {
    const input = await getTxnBYto_iban(req.body.iban);
    const output = await getTxnBYfrom_iban(req.body.iban);
    const balance = await getCurrentBalance(req.body.iban);
    res.status(200).send({ input: input.rows, output: output.rows, balance });
  } catch (error) {
    console.error("Middleware layer, error notification:", error);
    res.status(500).send("Internal server error");
  }
});

users.get("/account", async (req, res) => {
  console.log(`GET: ${host}/user/account`);
  if (req.body.beneficiary == undefined) {
    res.status(400).send("Bad request.");
    return;
  }
  try {
    const all_users = await getAccountBYbeneficiary(
      req.body.beneficiary as string
    );
    res.status(200).send(all_users.rows);
  } catch (error) {
    console.error("Middleware layer, error notification:", error);
    res.status(500).send("Internal server error");
  }
});

users.post("/account", async (req, res) => {
  console.log(`POST: ${host}/user/account`);
  if (req.body.beneficiary == undefined) {
    res.status(400).send("Bad request.");
    return;
  }
  try {
    const iban =
      "BG" + "28" + "MONI" + randomInt(10000000000000, 99999999999999);
    const result = await createAccount(req.body.beneficiary, iban);
    res.status(200).send(result);
  } catch (error) {
    console.error("Middleware layer, error notification:", error);
    res.status(500).send("Internal server error");
  }
});

users.delete("/account", async (req, res) => {
  console.log(`DELETE: ${host}/user/account`);
  if (req.body.iban == undefined) {
    res.status(400).send("Bad request.");
    return;
  }
  try {
    //TODO check if balance is non zero

    const result = await deleteAccount(req.body.iban as string);
    res.status(200).send(result);
  } catch (error) {
    console.error("Middleware layer, error notification:", error);
    res.status(500).send("Internal server error");
  }
});

users.patch("/forgotten", async (req, res) => {
  console.log(`PATCH: ${host}/user/forgotten`);
  if (req.body.email == undefined || req.body.password == undefined) {
    res.status(400).send("Bad request.");
    return;
  }
  try {
    const result = await changePassword(
      req.body.email as string,
      req.body.password as string
    );
    res.status(200).send(result);
  } catch (error) {
    console.error("Middleware layer, error notification:", error);
    res.status(500).send("Internal server error");
  }
});

users.patch("/role", async (req, res) => {
  console.log(`PATCH: ${host}/user/role`);
  if (req.body.email == undefined || req.body.role == undefined) {
    res.status(400).send("Bad request.");
    return;
  }
  try {
    const result = await changeRole(
      req.body.email as string,
      req.body.role as string
    );
    res.status(200).send(result);
  } catch (error) {
    console.error("Middleware layer, error notification:", error);
    res.status(500).send("Internal server error");
  }
});

export default users;
