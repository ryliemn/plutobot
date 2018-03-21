var { dbConnector } = require('../db');

module.exports = {
  name: 'addartist',
  trigger: '.addartist',
  handler: addartist
};

async function addartist(message) {
  const db = dbConnector();
  db.connect();
  const artistName = message.split(' ').splice(1).join(' ');
  let response = null;
  if (artistName !== 'help') {
    try {
      const result = await db.query(
        'SELECT * FROM rateify.add_artist($1)',
        [artistName]
      );
      response = `I made the following new artist record:
        ${result.rows[0].id} \t\t ${result.rows[0].name}`;
    } catch (err) {
      response = err.stack;
    }
  } else {
    response = `Usage:
      .addartist [Artist Name]`;
  }
  db.end();
  return response;
}
