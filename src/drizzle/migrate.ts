// Steps
// Imports
import "dotenv/config"
import { migrate } from "drizzle-orm/node-postgres/migrator"
import db from "./db"
import {client} from "./db"
// Creating Our Migration
async function migration(){
    console.log("-----------Hey Migration Started-------------")
    await migrate(db, {migrationsFolder: __dirname + "/migrations"});
    await client.end();
    console.log("-----------Migration Ended=------------");
    process.exit(0);
}

// catch Errors
migration().catch((e)=>{
   console.log(e);
   process.exit(0);
})