const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  user: 'jordant.',
  database: 'tuneset',
  password: 'jordant',
  port: 5432
});

pool.connect()
  .then(() => {
    console.log('pool connected')
  })
  .catch((err) => {
    console.log(err);
  })

module.exports = pool;