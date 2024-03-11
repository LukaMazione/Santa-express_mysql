const { createPool } = require('mysql2/promise');

const pool = createPool({
  host: 'xxx',
  database: 'xxx',
  user: 'xxx',
  namedPlaceholders: true, // dla :nazwaZmiennej zamiast ?
  decimalNumbers: true,
});

module.exports = {
  pool,
};
