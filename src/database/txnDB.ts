import { standartQuery } from "./config";

export async function getTxnBYtime(time: string) {
  return await standartQuery(
    "SELECT (timestamp, from_iban, to_iban, amount, reason, tax) FROM transactions WHERE timestamp=$1",
    [time]
  );
}
