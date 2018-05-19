global.__basedir = __dirname;

const config = require(__basedir + '/config.json');
const commando = require("discord.js-commando");
const {
    Attachment
} = require('discord.js');
const mysql = require('mysql');
const con = require('./db_helper');
const fs = require('fs');

const bot = new commando.Client({
    owner: config.bot.owner,
    commandPrefix: config.bot.prefix,
    unknownCommandResponse: false
});

bot.on("ready", () => {
    bot.user.setActivity(`Prefix: ${config.bot.prefix}`);
});

bot.on("message", (message) => {
    logMessage(message);

    if (message.member == null || message.channel.type == "dm" || message.member.user.bot) return false;

    if (message.content.length >= config.loyalty.min_length) {
        con.query(`SELECT * FROM users WHERE client_id = ${mysql.escape(message.member.id)} AND guild_id = ${mysql.escape(message.channel.guild.id)}`, function (err, result, fields) {
            if (err) console.log(err);
            if (typeof result == 'undefined') return;
            if (result.length == 0) {
                con.query(`INSERT INTO users (username, client_id, guild_id, points) VALUES (${mysql.escape(message.author.username)}, ${mysql.escape(message.member.id)}, ${mysql.escape(message.channel.guild.id)}, ${config.loyalty.ppm})`, function (err, result, fields) {
                    if (err) console.log(err);
                });
            } else {
                con.query(`UPDATE users set points = '${result[0].points+config.loyalty.ppm}' WHERE client_id = ${mysql.escape(message.member.id)} AND guild_id = ${mysql.escape(message.channel.guild.id)}`, function (err, result, fields) {
                    if (err) console.log(err);
                });
            }
        });
    }

});

function logMessage(message) {
    var tzoffset = (new Date()).getTimezoneOffset() * 60000;
    var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
    let date = localISOTime
        .replace(/T/, ' ')
        .replace(/\..+/, '');
    let log_data = "";
    let content = message.content.replace(/(?:\r\n|\r|\n)/g, ' ');
    log_data += `\n${date} | #${message.channel.name} | (${message.author.id}) ${message.author.username}: ${content}`;

    let attachments = message.attachments.array();
    if (attachments.length > 0) {
        log_data += " Files{";
        for (let i = 0; i < attachments.length; i++) {
            log_data += attachments[i].url;
            if (i + 1 < attachments.length) {
                log_data += ", ";
            }
        }
        log_data += "}";
    }

    fs.appendFile(`${__dirname}/logs/${message.channel.id}.log`, log_data, function (err) {
        if (err) throw err;
    });
}

bot.registry
    .registerGroup("util", "Util")
    .registerGroup("games", "Games")
    .registerGroup("loyalty", "Loyalty")
    .registerGroup("ai", "Ai")
    .registerGroup("text", "Text")
    .registerGroup("nsfw", "NSFW")
    .registerGroup("image", "Image")
    .registerGroup("fun", "Fun")
    .registerGroup("moderation", "Moderation")
    .registerDefaults()
    .registerCommandsIn(__dirname + "/commands");
bot.login(config.bot.token);