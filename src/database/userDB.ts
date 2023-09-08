import { standartQuery } from "./config";

export async function getAllUsers() {
  return await standartQuery("SELECT (email, username, role) FROM users");
}

export async function getUser(email: string) {
  return await standartQuery(
    "SELECT (email, username, role) FROM users WHERE email=$1",
    [email]
  );
}

export async function createUser(
  email: string,
  password: string,
  username: string,
  role: string
) {
  return await standartQuery(
    "INSERT INTO users VALUES ($1::email,crypt($2, gen_salt('bf')),$3,$4::role)",
    [email, password, username, role]
  );
}

export async function deleteUser(email: string) {
  return await standartQuery(
    "DELETE FROM users WHERE email=$1",
    [email]
  );
}

export async function checkPassword(email: string, password: string) {
  return await standartQuery(
    "SELECT (password_hash = crypt($2, password_hash)) AS pswmatch FROM users WHERE email=$1;",
    [email,password]
  );
}