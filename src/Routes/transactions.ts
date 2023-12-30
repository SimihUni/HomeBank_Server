import express from 'express'
import { host } from '../enviroments'
import { createTxn, getCurrentBalance, getTxnBYtime } from '../database/txnDB'
import { AccessTokenAdminChecker, AccessTokenChecker, authenticateBearer } from '../auth_utils'
import { getAccountBYiban } from '../database/account'

const txns = express.Router()

// admin access
txns.get('/', AccessTokenAdminChecker, async (req, res) => {
  console.log(`GET: ${host}/txn/`)
  try {
    if (req.headers.authorization === undefined) {
      res.status(401).send('Unauthorized.')
      return
    }
    if (!await authenticateBearer((req.headers.authorization).split(' ')[1])) {
      res.status(401).send('Unauthorized.')
      return
    }
    if (req.body?.timestamp === undefined) {
      res.status(400).send('Bad request.')
      return
    }
    const allUsers = await getTxnBYtime(req.query.timestamp as string)
    res.status(200).send(allUsers.rows)
  } catch (error) {
    console.error('Middleware layer, error notification:', error)
    res.status(500).send('Internal server error.')
  }
})

txns.post('/', AccessTokenChecker, async (req, res) => {
  console.log(`POST: ${host}/txn/`)
  try {
    if (
      req.body?.iban === undefined || // from_iban has to be iban for AccessTokenChecker to work :(
      req.body?.to_iban === undefined ||
      req.body?.amount === undefined ||
      req.body?.reason === undefined ||
      req.body?.tax === undefined
    ) {
      res.status(400).send('Bad request.')
      return
    }
    if (req.body.iban == req.body.to_iban) {
      res.status(400).send('Bad request.')
      return
    }
    // NOTE don't know if amount and tax are numbers
    if ((await getCurrentBalance(req.body.iban)).rows[0].balance < Number(req.body.amount) + Number(req.body.tax)) {
      res.status(400).send("Account doesn't have the needed balance for this transaction.")
    }
    if ((await getAccountBYiban(req.body.to_iban)).rowCount !== 1) {
      res.status(404).send("to_iban doesn't exist.")
    }
    const result = await createTxn(
      req.body.from_iban as string,
      req.body.to_iban as string,
      req.body.amount as number,
      req.body.reason as string,
      req.body.tax as number
    )
    if (result.rowCount === 1) {
      res.status(201).send('Transaction created.')
    } else {
      // rowCount should be 0 if email is not found
      res.status(404).send('Not found.')
    }
  } catch (error) {
    console.error('Middleware layer, error notification:', error)
    res.status(500).send('Internal server error.')
  }
})

txns.post('/admin', AccessTokenAdminChecker, async (req, res) => {
  console.log(`POST: ${host}/txn/`)
  try {
    if (
      req.body?.from_iban === undefined ||
      req.body?.to_iban === undefined ||
      req.body?.amount === undefined ||
      req.body?.reason === undefined ||
      req.body?.tax === undefined
    ) {
      res.status(400).send('Bad request.')
      return
    }
    if (req.body.from_iban === req.body.to_iban) {
      res.status(400).send('Bad request.')
      return
    }
    // NOTE TO SELF = this is for admin use only, there are no checks for avalability of a user
    const result = await createTxn(
      req.body.from_iban as string,
      req.body.to_iban as string,
      req.body.amount as number,
      req.body.reason as string,
      req.body.tax as number
    )
    if (result.rowCount === 1) {
      res.status(201).send('Transaction created.')
    } else {
      // rowCount should be 0 if email is not found
      res.status(404).send('Not found.')
    }
  } catch (error) {
    console.error('Middleware layer, error notification:', error)
    res.status(500).send('Internal server error.')
  }
})

export default txns
