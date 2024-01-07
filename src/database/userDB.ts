import { QueryResult } from 'pg'
import { standartQuery } from './config'

export async function getAllUsers (): Promise<QueryResult<any>> {
  return await standartQuery('SELECT (email, username, role) FROM users')
}

export async function getUser (email: string): Promise<QueryResult<any>> {
  return await standartQuery(
    'SELECT (email, username, role) FROM users WHERE email=$1',
    [email]
  )
}

export async function createUser (
  email: string,
  password: string,
  username: string,
  role: string
): Promise<QueryResult<any>> {
  return await standartQuery(
    "INSERT INTO users VALUES ($1::email,crypt($2, gen_salt('bf')),$3,$4::role)",
    [email, password, username, role]
  )
}

export async function deleteUser (email: string): Promise<QueryResult<any>> {
  return await standartQuery(
    'DELETE FROM users WHERE email=$1',
    [email]
  )
}

export async function checkPassword (email: string, password: string): Promise<QueryResult<any>> {
  return await standartQuery(
    'SELECT (password_hash = crypt($2, password_hash)) AS pswmatch FROM users WHERE email=$1;',
    [email, password]
  )
}

export async function changePassword (email: string, password: string): Promise<QueryResult<any>> {
  return await standartQuery(
    "UPDATE users SET password_hash=crypt($2, gen_salt('bf')) WHERE email=$1",
    [email, password]
  )
}

export async function changeRole (email: string, role: string): Promise<QueryResult<any>> {
  return await standartQuery(
    'UPDATE users SET role=$2 WHERE email=$1',
    [email, role]
  )
}

export async function changeUsername (email: string, username: string): Promise<QueryResult<any>> {
  return await standartQuery(
    'UPDATE users SET username=$2 WHERE email=$1',
    [email, username]
  )
}
