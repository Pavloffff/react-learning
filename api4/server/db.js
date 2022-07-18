
const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password: "12dfYZ_12",
    host: "localhost",
    port: 5432,
    database: "project5_2"
})

module.exports = pool;