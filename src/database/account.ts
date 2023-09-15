import { standartQuery } from "./config";

export async function getAccountBYbeneficiary(beneficiary: string) {
  return await standartQuery(
    'SELECT ("IBAN", beneficiary) FROM account WHERE beneficiary=$1',
    [beneficiary]
  );
}

export async function createAccount(beneficiary: string, IBAN: string) {
  return await standartQuery(
    'INSERT INTO account VALUES ($1::iban,$2::email)',
    [IBAN, beneficiary]
  );
}


export async function deleteAccount(iban: string) {
  return await standartQuery(
    'DELETE FROM account WHERE "IBAN"=$1',
    [iban]
  );
}