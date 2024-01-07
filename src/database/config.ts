import { Pool, PoolClient, QueryResult } from 'pg'
import { db_host, db_port, db_password } from '../enviroments'

// database config
export const pool = new Pool({
  host: db_host,
  port: Number(db_port),
  max: 20,
  database: 'homebank',
  user: 'homebank',
  password: db_password,
  application_name: 'HomeBank Server'
})

// copied from pg documentation
export const getClient = async (): Promise<PoolClient> => {
  const client = await pool.connect()
  const query = client.query
  const release = client.release
  const queries = { lastQuery: {} }
  // set a timeout of 5 seconds, after which we will log this client's last query
  const timeout = setTimeout(() => {
    console.error('A client has been checked out for more than 5 seconds!')
    console.error(
      `The last executed query on this client was: ${queries.lastQuery}`
    )
  }, 5000)
  // monkey patch the query method to keep track of the last query executed
  // @ts-expect-error
  client.query = async (...args: any[]) => {
    queries.lastQuery = args
    const start = Date.now()
    const res = await query.apply(
      client,
      // @ts-expect-error
      args
    )
    const duration = Date.now() - start
    // @ts-expect-error
    console.log('executed query', { text: args[0], duration, rows: res.rowCount })
    return res
  }
  client.release = () => {
    // clear our timeout
    clearTimeout(timeout)
    // set the methods back to their old un-monkey-patched version
    client.query = query
    client.release = release
    return release.apply(client)
  }
  return client
}

/**
 * Function for handling standard parameterized queries to the DB
 *
 * May throw error if any, and logs it to console.error
 * @param text query (use $1, $2 and so on for the values)
 * @param values array with values referenced in the query
 * @returns result from query
 */
export async function standartQuery (text: string, values?: any[]): Promise<QueryResult<any>> {
  const client = await getClient()
  try {
    const query_res = await client.query(text, values)
    console.log(`Result from query:${text}\nwith values:${values}`)
    query_res.rows.map((row) => console.log(row))
    client.release()
    return query_res
  } catch (error) {
    console.error('Error while trying to query! Error:', error)
    client.release()
    throw error
  }
}
