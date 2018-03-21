var _ = require('lodash');
var { dbConnector } = require('../db');

module.exports = {
  name: 'addtracks',
  trigger: '.addtracks',
  handler: addtracks
};

async function addtracks(message) {
  const db = dbConnector();
  db.connect();
  const args = _.split(message.substring(module.exports.trigger.length + 1), '|');
  let response = '';
  if (args[0] !== 'help') {
    const albumID = args[0];
    const songNames = _.slice(args, 1);
    for (let name of songNames) {
      try {
        const result = await db.query(
          'SELECT * FROM rateify.add_track($1, $2)',
          [albumID, name]
        );
        response += `Added ${result.rows[0].new_name} as id ${result.rows[0].new_id}\n`;
      } catch (err) {
        response = err.stack;
      }
    }
  } else {
    response = `Usage: 
      .addtracks [Album ID]|[Track 1]|[Track 2]|...`;
  }
  db.end();
  return response;
}
