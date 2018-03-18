var { Client } = require('pg');
var auth = require('./auth.json');

module.exports = {
  dbConnector: () => {
    return new Client(auth.db);
  }
};
