var _ = require('lodash');
var { dbConnector } = require('../db');

module.exports = {
  name: 'findtrack',
  trigger: '.findtrack',
  handler: findtrack
};

const config = {
  MAX_RESULTS: 5
};

async function findtrack(message) {
  const db = dbConnector();
  db.connect();
  const query = message.split(' ').splice(1).join(' ');
  let response = null;
  try {
    const result = await db.query(
      'SELECT * FROM rateify.find_track($1)',
      [query]
    );
    if (!_.isEmpty(result.rows)) {
      response = `I found ${result.rows.length} results.`;
      response += result.rows.length > config.MAX_RESULTS
        ? ` You should refine your search. Here are ${config.MAX_RESULTS} results: \n`
        : ' Here are all of them: \n';
      _.forEach(_.take(result.rows, config.MAX_RESULTS), (row) => {
        response += `${row.id} \t\t ${row.track_name} (${row.rating} stars)
          ${row.artist_name} - ${row.album_name} \n`;
      });
    } else {
      response = 'I found no results. Try something else.';
    }
  } catch (err) {
    response = err.stack;
  }
  db.end();
  return response;
}
