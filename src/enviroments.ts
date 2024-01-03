import * as jose from 'jose'
const { readFileSync } = require('fs')

let privateJWK: jose.JWK
let publicJWK: jose.JWK
try {
  privateJWK = JSON.parse(readFileSync('./src/keys/private.key.json').toString()) as jose.JWK
  console.log(privateJWK)
  publicJWK = JSON.parse(readFileSync('./src/keys/public.key.json').toString()) as jose.JWK
  console.log(publicJWK)
  // TODO check if priveteJWK and publicJWK are in the right format
} catch (error) {
  console.error("No crypto keys defined in ./keys/",error)
}
const default_port = '3000'
const default_db_port = '5432'
const default_host = 'localhost'
const default_db_host = 'localhost'
const default_protocol = 'http://'
const default_db_password = ''

const port = process.env.PORT
  ? Number(process.env.PORT) < 1000 && Number(process.env.PORT) > 9999
    ? default_port
    : process.env.PORT
  : default_port
const host =
  default_protocol +
  (process.env.HOSTNAME ? process.env.HOSTNAME : default_host) +
  process.env.PORT
const db_port = process.env.DB_PORT
  ? Number(process.env.DB_PORT) < 1000 && Number(process.env.DB_PORT) > 9999
    ? default_db_port
    : process.env.DB_PORT
  : default_db_port
const db_host = process.env.DB_HOSTNAME
  ? process.env.DB_HOSTNAME
  : default_db_host
const db_password = process.env.DB_PASSWORD
  ? process.env.DB_PASSWORD
  : default_db_password

export { port, host, db_port, db_host, db_password, privateJWK, publicJWK }
