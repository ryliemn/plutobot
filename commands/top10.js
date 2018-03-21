var { dbConnector } = require('../db');

module.exports = {
  name: 'top10',
  trigger: '.top10',
  handler: top10
};

async function top10(message) {
  const db = dbConnector();
  db.connect();
  let response = '';
  try {
    const result = await db.query('SELECT * FROM rateify.top_10_albums');
    for (let i = 0; i < result.rows.length; i++) {
      let row = result.rows[i];
      response += `${i + 1}. (${row.rating} stars) ${row.artist_name} - ${row.album_name}\n`;
    }
  } catch (err) {
    response = err.stack;
  }
  db.end();
  return response;
}
