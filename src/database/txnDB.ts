import { getClient, standartQuery } from './config'

export async function getTxnBYtime (time: string) {
  return await standartQuery(
    'SELECT (timestamp, from_iban, to_iban, amount, reason, tax) FROM transactions WHERE timestamp=$1',
    [time]
  )
}

export async function getTxnBYfrom_iban (from_iban: string) {
  return await standartQuery(
    'SELECT (timestamp, from_iban, to_iban, amount, reason, tax) FROM transactions WHERE from_iban=$1',
    [from_iban]
  )
}

export async function getTxnBYto_iban (to_iban: string) {
  return await standartQuery(
    'SELECT (timestamp, from_iban, to_iban, amount, reason, tax) FROM transactions WHERE to_iban=$1',
    [to_iban]
  )
}

export async function createTxn (
  from_iban: string,
  to_iban: string,
  amount: number,
  reason: string,
  tax: number
) {
  return await standartQuery(
    'INSERT INTO transactions (from_iban,to_iban,amount,reason,tax) VALUES ($1::iban,$2::iban,$3,$4,$5)',
    [from_iban, to_iban, amount, reason, tax]
  )
}

export async function getCurrentBalance (iban: string) {
  return await standartQuery(
    'SELECT (SELECT CASE WHEN COUNT(to_iban) > 0 THEN SUM(amount) ELSE 0 END FROM transactions WHERE to_iban=$1) - (SELECT CASE WHEN COUNT(from_iban) > 0 THEN SUM(amount) ELSE 0 END FROM transactions WHERE from_iban=$1) as balance',
    [iban]
  )
}
