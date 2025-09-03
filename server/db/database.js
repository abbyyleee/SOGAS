// server/db/database.js

import mysql2 from "mysql2/promise";

const db = mysql2.createPool({
    host: "localhost",
    user: "root",
    password: "AcL03178312061290@",
    database: "southern_gas_services"
});

export { db };