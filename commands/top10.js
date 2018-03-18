module.exports = {
  name: 'top10',
  trigger: '.top10',
  handler: top10
};

async function top10(message, db) {
  try {
    const result = await db.query('SELECT * FROM rateify.top_10_albums');
    return result.rows[0].artist_name;
  } catch (err) {
    return err.stack;
  }
}
