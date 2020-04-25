const { Pool } = require('pg');
const pool = new Pool({
  host: process.env.DBSERVER,
  user: process.env.SQLUSER,
  password: process.env.SQLPASS,
  database: 'sdc',
  idleTimeoutMillis: 5000,
  max: 14,
});

pool.connect();

module.exports = pool;
