import express from "express";
import { host } from "../enviroments";
import { createTxn, getTxnBYtime } from "../database/txnDB";

const txns = express.Router();

txns.get("/", async (req, res) => {
  console.log(`GET: ${host}/txn/`);
  try {
    const all_users = await getTxnBYtime(req.query.timestamp as string);
    res.status(200).send(all_users.rows);
  } catch (error) {
    console.error("Middleware layer, error notification:", error);
    res.status(500).send("Internal server error");
  }
});

txns.post("/", async (req, res) => {
  console.log(`POST: ${host}/txn/`);

  //NOTE TO SELF = this is for admin use only, there are no checks for avalability of a user
  const result = await createTxn(
    req.body.from_iban as string,
    req.body.to_iban as string,
    req.body.amount as number,
    req.body.reason as string,
    req.body.tax as number
  );
  res.status(200).send(result.rows);
});

export default txns;
