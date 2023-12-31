import express from 'express'
import { host } from '../enviroments'
import {
  changePassword,
  changeRole,
  changeUsername,
  deleteUser,
  getAllUsers,
  getUser
} from '../database/userDB'
import {
  createAccount,
  deleteAccount,
  getAccountBYbeneficiary
} from '../database/account'
import { randomInt } from 'crypto'
import {
  getCurrentBalance,
  getTxnBYfrom_iban,
  getTxnBYto_iban
} from '../database/txnDB'
import { AccessTokenAdminChecker, AccessTokenChecker } from '../auth_utils'

const users = express.Router()

// admin access
users.get('/all', AccessTokenAdminChecker, async (req, res) => {
  console.log(`GET: ${host}/user/all`)
  try {
    const all_users = await getAllUsers()
    res.status(200).send(all_users.rows)
  } catch (error) {
    console.error('Middleware layer, error notification:', error)
    res.status(500).send('Internal server error')
  }
})

users.get('/', AccessTokenChecker, async (req, res) => {
  console.log(`GET: ${host}/user/`)
  console.log(req.body)
  if (req.body?.email === undefined) {
    res.status(400).send('Bad request.')
    return
  }
  try {
    const user = await getUser(req.body.email as string)
    res.status(200).send(user.rows)
  } catch (error) {
    console.error('Middleware layer, error notification:', error)
    res.status(500).send('Internal server error')
  }
})

users.delete('/', AccessTokenChecker, async (req, res) => {
  console.log(`DELETE: ${host}/user/`)
  if (req.body?.email === undefined) {
    res.status(400).send('Bad request.')
    return
  }
  try {
    const accounts = await getAccountBYbeneficiary(req.body.email as string)
    if (accounts.rowCount > 0) {
      res.status(403).send("User still has accounts, can't delete it.")
      return
    }
    const result = await deleteUser(req.body.email as string)
    if (result.rowCount === 1) {
      res.status(200).send('User deleted.')
    } else {
      // rowCount should be 0 if email is not found
      res.status(404).send('Not found.')
    }
  } catch (error) {
    console.error('Middleware layer, error notification:', error)
    res.status(500).send('Internal server error')
  }
})

users.patch('/username', AccessTokenChecker, async (req, res) => {
  console.log(`PATCH: ${host}/user/username`)
  if (req.body?.email === undefined || req.body?.new_username === undefined) {
    res.status(400).send('Bad request.')
    return
  }
  try {
    const result = await changeUsername(
      req.body.email as string,
      req.body.new_username as string
    )
    if (result.rowCount === 1) {
      res.status(200).send('Username changed.')
    } else {
      // rowCount should be 0 if email is not found
      res.status(404).send('Not found.')
    }
  } catch (error) {
    console.error('Middleware layer, error notification:', error)
    res.status(500).send('Internal server error.')
  }
})

users.get('/balance', AccessTokenChecker, async (req, res) => {
  console.log(`GET: ${host}/user/balance`)
  if (req.body?.iban === undefined) {
    res.status(400).send('Bad request.')
    return
  }
  try {
    const input = await getTxnBYto_iban(req.body.iban)
    const output = await getTxnBYfrom_iban(req.body.iban)
    const balance = await getCurrentBalance(req.body.iban)
    res
      .status(200)
      .json({
        input: input.rows,
        output: output.rows,
        balance: balance.rows[0].balance
      })
  } catch (error) {
    console.error('Middleware layer, error notification:', error)
    res.status(500).send('Internal server error.')
  }
})

users.get('/accounts', AccessTokenChecker, async (req, res) => {
  console.log(`GET: ${host}/user/accounts`)
  if (req.body?.email === undefined) {
    res.status(400).send('Bad request.')
    return
  }
  try {
    const all_users = await getAccountBYbeneficiary(
      req.body.email as string
    )
    res.status(200).send(all_users.rows)
  } catch (error) {
    console.error('Middleware layer, error notification:', error)
    res.status(500).send('Internal server error.')
  }
})

users.post('/account', AccessTokenChecker, async (req, res) => {
  console.log(`POST: ${host}/user/account`)
  if (req.body?.email === undefined) {
    res.status(400).send('Bad request.')
    return
  }
  try {
    const iban =
      'BG' + '28' + 'MONI' + randomInt(10000000000000, 99999999999999)
    const result = await createAccount(req.body.email, iban, req.body?.name)

    if (result.rowCount === 1) {
      res.status(201).send('New account created.')
    } else {
      // rowCount should be 0 if email is not found
      res.status(404).send('Not found.')
    }
  } catch (error) {
    console.error('Middleware layer, error notification:', error)
    res.status(500).send('Internal server error.')
  }
})

users.delete('/account', AccessTokenChecker, async (req, res) => {
  console.log(`DELETE: ${host}/user/account`)
  if (req.body?.iban === undefined) {
    res.status(400).send('Bad request.')
    return
  }
  try {
    const balance = await getCurrentBalance(req.body.iban as string)
    if (balance.rows[0].balance !== 0) {
      res.status(403).send("Account has positive balance, can't delete it.")
      return
    }
    const result = await deleteAccount(req.body.iban as string)

    if (result.rowCount === 1) {
      res.status(200).send('Account deleted.')
    } else {
      // rowCount should be 0 if email is not found
      res.status(404).send('Not found.')
    }
  } catch (error) {
    console.error('Middleware layer, error notification:', error)
    res.status(500).send('Internal server error.')
  }
})

users.patch('/forgotten', AccessTokenChecker, async (req, res) => {
  console.log(`PATCH: ${host}/user/forgotten`)
  if (req.body?.email === undefined || req.body?.password === undefined) {
    res.status(400).send('Bad request.')
    return
  }
  try {
    const result = await changePassword(
      req.body.email as string,
      req.body.password as string
    )
    if (result.rowCount === 1) {
      res.status(200).send('Password changed.')
    } else {
      // rowCount should be 0 if email is not found
      res.status(404).send('Not found.')
    }
  } catch (error) {
    console.error('Middleware layer, error notification:', error)
    res.status(500).send('Internal server error.')
  }
})

// admin access
users.patch('/role', AccessTokenAdminChecker, async (req, res) => {
  console.log(`PATCH: ${host}/user/role`)
  if (req.body?.email === undefined || req.body?.role === undefined) {
    res.status(400).send('Bad request.')
    return
  }
  try {
    const result = await changeRole(
      req.body.email as string,
      req.body.role as string
    )
    if (result.rowCount === 1) {
      res.status(200).send('Role changed.')
    } else {
      // rowCount should be 0 if email is not found
      res.status(404).send('Not found.')
    }
  } catch (error) {
    console.error('Middleware layer, error notification:', error)
    res.status(500).send('Internal server error.')
  }
})

export default users
