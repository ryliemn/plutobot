module.exports = {
  name: 'goodboy',
  trigger: '.goodboy',
  handler: goodboy
};

async function goodboy(message, db) {
  return 'Arfff';
}
