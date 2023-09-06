import { Pool } from "pg";

export const pool = new Pool({
  host: "localhost",
  port: 5432,
  max: 20,
  database: "homebank",
  user: "homebank",
  password: "password",
  application_name: "HomeBank Server",
});

// export const query = async (text: string | QueryConfig<any>, params: any) => {
//   const start = Date.now();
//   const res = await pool.query(text, params);
//   const duration = Date.now() - start;
//   console.log("executed query", { text, duration, rows: res.rowCount });
//   return res;
// };

export const getClient = async () => {
  const client = await pool.connect();
  const query = client.query;
  const release = client.release;
  const queries = { lastQuery: {} };
  // set a timeout of 5 seconds, after which we will log this client's last query
  const timeout = setTimeout(() => {
    console.error("A client has been checked out for more than 5 seconds!");
    console.error(
      `The last executed query on this client was: ${queries.lastQuery}`
    );
  }, 5000);
  // monkey patch the query method to keep track of the last query executed
  // @ts-ignore
  client.query = async (...args: any[]) => {
    queries.lastQuery = args;
    const start = Date.now();
    const res = await query.apply(
      client,
      // @ts-ignore
      args
    );
    const duration = Date.now() - start;
    // @ts-ignore
    console.log("executed query", { text : args[0] , duration, rows: res.rowCount });
    return res;
  };
  client.release = () => {
    // clear our timeout
    clearTimeout(timeout);
    // set the methods back to their old un-monkey-patched version
    client.query = query;
    client.release = release;
    return release.apply(client);
  };
  return client;
};


export async function standartQuery(text: string, values?: any[]) {
  const client = await getClient();
  try {
    const query_res = await client.query(text, values);
    console.log(`Result from query:${text}\nwith values:${values}`);
    query_res.rows.map((row) => console.log(row));
    client.release();
    return query_res;
  } catch (error) {
    console.error("Error while trying to query! Error:", error);
    client.release();
    throw error;
  }
}