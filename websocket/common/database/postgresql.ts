import { Pool } from "pg";
import { pgID, pgPW, pgHost, pgPort, pgDatabase, pgPoolMax } from "../const/environment";

const pool = new Pool({
    user: pgID,
    password: pgPW,
    host: pgHost,
    port: Number(pgPort),
    database: pgDatabase,
    max: pgPoolMax
})

pool.connect()

export default pool