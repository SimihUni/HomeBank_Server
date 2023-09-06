import { standartQuery } from "./config";

export async function getAllUsers() {
  return await standartQuery("SELECT (email, username, role) FROM users");
}

export async function getUser(email: string) {
  return await standartQuery("SELECT (email, username, role) FROM users WHERE email=$1",[email]);
}