const { Pool } = require('pg');
const pool = new Pool({
  host: 'localhost',
  user: 'hackreactor',
  password: 'password',
  database: 'sdc',
  idleTimeoutMillis: 5000,
});

pool.connect();

module.exports.connection = pool;
