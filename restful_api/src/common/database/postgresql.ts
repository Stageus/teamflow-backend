import { Pool } from "pg";
import { pgID, pgPW, pgHost, pgPort, pgDatabase, pgPoolMax } from "../const/environment";

const pool = new Pool({
    user: pgID,
    password: pgPW,
    host: pgHost,
    port: Number(pgPort),
    database: pgDatabase,
    max: 5
})

pool.connect()

export default pool