const config = require(__basedir + '/config.json');
const commando = require("discord.js-commando");
const { RichEmbed } = require('discord.js');
const mysql = require('mysql');
const con = require(__basedir + '/db_helper');

class TopCommand extends commando.Command {

    constructor(client) {
        super(client, {
            name: 'top',
            group: 'loyalty',
            memberName: 'top',
            description: 'Shows the top list of users'
        });
    }

    async run(message, args) {
        message.channel.startTyping();
        if (config.loyalty.enable === false) return;
        con.query(`SELECT * FROM users WHERE guild_id = ${message.channel.guild.id} ORDER BY points DESC LIMIT 10`, function (err, result, fields) {
            if (err) console.log(err);
            if (result.length > 0) {
                let top = "";

                for (let i = 0; i < result.length; i++) {
                    top += `#${i+1} **${result[i].username}** with **${result[i].points}** points.\n\n`;
                }
                let embed = new RichEmbed()
                    .setColor(config.bot.color)
                    .addField("Top 10", top)
                    .setThumbnail(config.bot.avatar)
                    .setFooter(config.bot.name, config.bot.avatar);
                message.channel.send(embed);
            } else {
                message.reply(`404 NOT FOUND!`);
            }
        });
        message.channel.stopTyping(true);
    }

}

module.exports = TopCommand;