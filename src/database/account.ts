import { standartQuery } from "./config";

export async function getAccountBYbeneficiary(beneficiary: string) {
  return await standartQuery(
    'SELECT ("IBAN", beneficiary, name) FROM account WHERE beneficiary=$1',
    [beneficiary]
  );
}

export async function getAccountBYiban(iban: string) {
  return await standartQuery(
    'SELECT ("IBAN", beneficiary, name) FROM account WHERE "IBAN"=$1',
    [iban]
  );
}

export async function createAccount(beneficiary: string, IBAN: string, name?: string) {
  if(name !== undefined){
    return await standartQuery(
      'INSERT INTO account VALUES ($1::iban,$2::email,$3)',
      [IBAN, beneficiary,name]
    );
  }
  return await standartQuery(
    'INSERT INTO account ("IBAN", beneficiary) VALUES ($1::iban,$2::email)',
    [IBAN, beneficiary]
  );
}


export async function deleteAccount(iban: string) {
  return await standartQuery(
    'DELETE FROM account WHERE "IBAN"=$1',
    [iban]
  );
}
