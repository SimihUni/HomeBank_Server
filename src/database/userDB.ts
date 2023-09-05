import { getClient } from "./config";

export async function getAllUsers() {
  const client = await getClient();
  const text = "SELECT (email, username, role) FROM users";
  try {
    const query_res = await client.query(text);
    console.log("All users:");
    query_res.rows.map((row) => console.log(row));
    client.release();
    return query_res;
  } catch (error) {
    console.error("Error while trying to query! Error:", error);
    client.release();
    throw error;
  }
}

export async function getUser(email: string) {
  const client = await getClient();
  const text = "SELECT (email, username, role) FROM users WHERE email=$1";
  const values = [email];
  try {
    const query_res = await client.query(text, values);
    console.log(`User with email ${email} :`);
    query_res.rows.map((row) => console.log(row));
    client.release();
    return query_res;
  } catch (error) {
    console.error("Error while trying to query! Error:", error);
    client.release();
    throw error;
  }
}
