import { standartQuery } from "./config";

export async function getAccountBYbeneficiary(beneficiary: string) {
  return await standartQuery(
    'SELECT ("IBAN", beneficiary) FROM account WHERE beneficiary=$1',
    [beneficiary]
  );
}

export async function createAccount(beneficiary: string, IBAN: string) {
  return await standartQuery(
    "INSERT INTO account VALUES (IBAN=$1,beneficiary=$2)",
    [IBAN, beneficiary]
  );
}
