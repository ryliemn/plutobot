var _ = require('lodash');

module.exports = {
  name: 'findtrack',
  trigger: '.findtrack',
  handler: findtrack
};

const config = {
  MAX_RESULTS: 5
};

async function findtrack(message, db) {
  const query = message.split(' ').splice(1).join(' ');
  try {
    const result = await db.query(
      'SELECT * FROM rateify.find_track($1)',
      [query]
    );
    let response = null;
    if (!_.isEmpty(result.rows)) {
      response = 'I found ' + result.rows.length + ' results.';
      response += result.rows.length > config.MAX_RESULTS
        ? ' You should refine your search. Here are ' + config.MAX_RESULTS + ' results: \n'
        : ' Here are all of them: \n';
      _.forEach(_.take(result.rows, config.MAX_RESULTS), (row) => {
        response += row.id + '\t\t' +
          row.track_name + ' (' + row.rating + ' stars)\n' +
          row.artist_name + ' - ' + row.album_name + '\n';
      });
    } else {
      response = 'I found no results. Try something else.';
    }
    return response;
  } catch (err) {
    return err.stack;
  }
}
