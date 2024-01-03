import * as jose from 'jose'
import { host, privateJWK, publicJWK } from './enviroments'
import { getAccountBYiban } from './database/account'
import { NextFunction, Request, Response } from 'express'

export async function authenticateBearer (
  token: string,
  pbJWK: jose.JWK = publicJWK
): Promise<boolean> {
  try {
    // const { payload, protectedHeader } = await jose.jwtVerify(
    //   token,
    //   await jose.importJWK(pbJWK as jose.JWK, 'ES256'),
    //   {
    //     algorithms: ['ES256'],
    //     issuer: host,
    //     subject: 'Client Authorization',
    //     requiredClaims: ['isAdmin']
    //   }
    // )
    // console.log(payload);
    return true
  } catch (error) {
    console.error('Error when verifying access token. Error: ', error)
    return false
  }
}

export async function generateAuthTokens (email: string, isAdmin: boolean, prJWK: jose.JWK = privateJWK) {
  try {
    const accessToken = await new jose.SignJWT({ isAdmin })
      .setIssuer(host)
      .setIssuedAt()
      .setExpirationTime('5m')
      .setSubject('Client Authorization')
      .setProtectedHeader({ typ: 'JWT', alg: 'ES256' })
      .setAudience(email)
      .sign(await jose.importJWK(prJWK, 'ES256'))
    const refreshToken = await new jose.SignJWT({ isAdmin })
      .setIssuer(host)
      .setIssuedAt()
      .setExpirationTime('20m')
      .setSubject('Client refresh')
      .setProtectedHeader({ typ: 'JWT', alg: 'ES256' })
      .setAudience(email)
      .sign(await jose.importJWK(prJWK, 'ES256'))
    return { accessToken, refreshToken }
  } catch (error) {
    console.error('Error when generating auth tokens.',error)
    throw error
  }
}

// email or iban
export async function checkOwnership (
  token: string,
  toCheck: { email?: string, iban?: string }
): Promise<boolean> {
  let result = false
  try {
    if (jose.decodeJwt(token).isAdmin) {
      return true
    }
    if (toCheck.email !== undefined) {
      if (jose.decodeJwt(token).aud === toCheck.email) {
        result = true
      }
    }
    if (toCheck.iban !== undefined) {
      const account_query = await getAccountBYiban(toCheck.iban)
      if (account_query.rowCount == 0) {
        result = false
        return result
      }
      if (jose.decodeJwt(token).aud === account_query.rows[0].beneficiary) {
        result = true
      }
    }
  } catch (error) {
    console.error('Error when checking ownership with access tokens.')
    return false
  }
  return result
}

export async function AccessTokenAdminChecker (req: Request, res: Response, next: NextFunction) {
  if (req.headers.authorization === undefined) {
    res.status(401).send('Unauthorized.')
    return
  }
  if ((req.headers.authorization).split(' ')[0] !== 'Bearer') {
    res.status(401).send('Unauthorized.')
    return
  }
  const token = (req.headers.authorization).split(' ')[1]
  if (!await authenticateBearer(token)) {
    res.status(401).send('Unauthorized.')
    return
  }
  if (!jose.decodeJwt(token).isAdmin) {
    res.status(401).send('Unauthorized.')
    return
  }
  next()
}

export async function AccessTokenChecker (req: Request, res: Response, next: NextFunction) {
  if (req.headers.authorization === undefined) {
    res.status(401).send('Unauthorized.')
    return
  }
  if ((req.headers.authorization).split(' ')[0] !== 'Bearer') {
    res.status(401).send('Unauthorized.')
    return
  }
  if (!await authenticateBearer((req.headers.authorization).split(' ')[1])) {
    res.status(401).send('Unauthorized.')
    return
  }
  if ((req.body.email === undefined && req.body.iban === undefined) || (req.body.email !== undefined && req.body.iban !== undefined)) {
    res.status(400).send('Bad request.')
    return
  }
  const toCheck = {
    email: req.body.email,
    iban: req.body.iban
  }
  if (!await checkOwnership((req.headers.authorization).split(' ')[1], toCheck)) {
    res.status(401).send('Unauthorized.')
    return
  }
  next()
}
