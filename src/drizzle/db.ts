// Steps
// Work on our imports
import "dotenv/config"
import { drizzle } from "drizzle-orm/node-postgres"
import { Client } from "pg"
import * as schema from "../drizzle/schema"

// define our Client
export const client = new Client({
    connectionString: process.env.DATABASE_URL as string
})

// Catch error
const main = async () => {
    await client.connect();
}
main().catch(console.error);

const db = drizzle(client,{schema, logger: true});

export default db;
