const { Pool } = require('pg');
const pool = new Pool({
  host: '52.200.147.255',
  user: 'hackreactor',
  password: 'password',
  database: 'sdc',
  idleTimeoutMillis: 5000,
});

pool.connect();

module.exports = pool;
