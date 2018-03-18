var _ = require('lodash');
var { Client } = require('pg');
var Discord = require('discord.io');
var fs = require('fs');
var logger = require('winston');
var path = require('path');

var auth = require('./auth.json');

var client = new Client(auth.db);

logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
  colorize: true
});
logger.level = 'debug';

var bot = new Discord.Client({
  token: auth.token,
  autorun: true
});

const commands = [];

function loadCommands() {
  const commandPath = path.join(__dirname, 'commands');
  const files = _.filter(fs.readdirSync(commandPath), fileName => _.endsWith(fileName, '.js'));

  _.each(files, (file) => {
    const command = require(`./commands/${file}`);
    commands.push(command);
    logger.info(`Loaded ${command.name}`);
  });
}

async function pluto(user, userID, channelID, message, evt) {
  if (userID === bot.id) return;

  const command = commands.find((c) => {
    return message.startsWith(c.trigger);
  });

  if (command) {
    logger.info(`Executing ${command.name} command`);
    const response = await command.handler(message, client);
    bot.sendMessage({
      to: channelID,
      message: response
    });
  }
}

loadCommands();

bot.on('ready', function (evt) {
  logger.info('Connected');
  logger.info('Logged in as: ');
  logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', pluto);

client.connect();
