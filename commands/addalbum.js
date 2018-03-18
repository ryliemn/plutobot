var _ = require('lodash');
var Moment = require('moment');
var { dbConnector } = require('../db');

module.exports = {
  name: 'addalbum',
  trigger: '.addalbum',
  handler: addalbum
};

async function addalbum(message) {
  const db = dbConnector();
  db.connect();
  const args = _.split(message.substring(module.exports.trigger.length), '|');
  let response = null;
  if (args.length === 4) {
    try {
      const result = await db.query(
        'SELECT * FROM rateify.add_album($1, $2, $3, $4)',
        args
      );
      response = `I made the following new album record:
        ${result.rows[0].new_id} \t\t ${result.rows[0].new_name} by ${result.rows[0].new_artist_name}
        ${result.rows[0].new_album_type} released on ${new Moment(result.rows[0].new_release_date).format('YYYY-MM-DD')}`;
    } catch (err) {
      response = err.stack;
    }
  } else {
    response = `Usage: 
      .addalbum [Artist ID]|[Album Name]|[Release date yyyy-mm-dd]|[Album, EP, or Single]`;
  }
  db.end();
  return response;
}
