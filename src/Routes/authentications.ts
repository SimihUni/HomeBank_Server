import express from 'express'
import { host } from '../enviroments'
import { checkPassword, createUser, getUser } from '../database/userDB'
import { authenticateBearer, generateAuthTokens } from '../auth_utils'

const authN = express.Router()

authN.post('/login', async (req, res) => {
  console.log(`POST: ${host}/auth/login`)
  if (req.body?.email === undefined || req.body?.password === undefined) {
    res.status(400).send('Bad request.')
    return
  }
  try {
    const result = await checkPassword(req.body.email, req.body.password)
    if (result.rowCount === 0) {
      // no such users
      res.status(400).send('Bad credentials.')
      return
    }
    if (result.rows[0].pswmatch) {
      // pass match yes
      const isAdmin = (await getUser(req.body?.email as string)).rows[0].role === 'admin'
      res.status(202).json(await generateAuthTokens(req.body?.email as string, isAdmin))
    } else {
      // pass match no
      res.status(400).send('Bad credentials.')
    }
  } catch (error) {
    console.error('Middleware layer, error notification:', error)
    res.status(500).send('Internal server error.')
  }
})

authN.post('/refresh', async (req, res) => {
  console.log(`POST: ${host}/auth/refresh`)
  // const bearer = (req.headers.authorization as string).split(' ')[1]
  // TODO post refresh token for auth token
  res.status(501).send('Not implemented yet.')
})

// admin access??
authN.post('/register', async (req, res) => {
  console.log(`POST: ${host}/auth/register`)
  if (
    req.body?.email === undefined ||
    req.body?.password === undefined ||
    req.body?.username === undefined
  ) {
    res.status(400).send('Bad request.')
    return
  }
  try {
    const result = await createUser(
      req.body.email,
      req.body.password,
      req.body.username,
      'client'
    )
    if (result.rowCount === 1) {
      res.status(201).send('User created.')
    } else {
      // rowCount should be 0 if email is not found
      res.status(400).send('Failed.')
    }
  } catch (error) {
    console.error('Middleware layer, error notification:', error)
    res.status(500).send('Internal server error.')
  }
})

export default authN
