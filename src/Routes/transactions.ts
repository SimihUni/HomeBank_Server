import express from "express";
import { host } from "../enviroments";
import { createTxn, getTxnBYtime } from "../database/txnDB";

const txns = express.Router();

txns.get("/", async (req, res) => {
  console.log(`GET: ${host}/txn/`);
  try {
    if (req.body?.timestamp === undefined) {
      res.status(400).send("Bad request.");
      return;
    }
    const all_users = await getTxnBYtime(req.query.timestamp as string);
    res.status(200).send(all_users.rows);
  } catch (error) {
    console.error("Middleware layer, error notification:", error);
    res.status(500).send("Internal server error.");
  }
});

txns.post("/", async (req, res) => {
  console.log(`POST: ${host}/txn/`);
  try {
    if (
      req.body?.from_iban === undefined ||
      req.body?.to_iban === undefined ||
      req.body?.amount === undefined ||
      req.body?.reason === undefined ||
      req.body?.tax === undefined
    ) {
      res.status(400).send("Bad request.");
      return;
    }
    if (req.body.from_iban == req.body.to_iban) {
      res.status(400).send("Bad request.");
      return;
    }
    //NOTE TO SELF = this is for admin use only, there are no checks for avalability of a user
    const result = await createTxn(
      req.body.from_iban as string,
      req.body.to_iban as string,
      req.body.amount as number,
      req.body.reason as string,
      req.body.tax as number
    );
    if (result.rowCount == 1) {
      res.status(201).send("Transaction created.");
    } else {
      //rowCount should be 0 if email is not found
      res.status(404).send("Not found.");
    }
  } catch (error) {
    console.error("Middleware layer, error notification:", error);
    res.status(500).send("Internal server error.");
  }
});

export default txns;
