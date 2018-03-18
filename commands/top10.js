var { dbConnector } = require('../db');

module.exports = {
  name: 'top10',
  trigger: '.top10',
  handler: top10
};

async function top10(message) {
  const db = dbConnector();
  db.connect();
  let response = null;
  try {
    const result = await db.query('SELECT * FROM rateify.top_10_albums');
    response = result.rows[0].artist_name;
  } catch (err) {
    response = err.stack;
  }
  db.end();
  return response;
}
