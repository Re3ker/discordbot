const config = require(__basedir + '/config.json');
const commando = require("discord.js-commando");
const mysql = require('mysql');
const con = require(__basedir + '/db_helper');
class RankCommand extends commando.Command {

    constructor(client) {
        super(client, {
            name: 'rank',
            group: 'loyalty',
            memberName: 'rank',
            description: 'Displays your current rank'
        });
    }

    async run(message, args) {
        message.channel.startTyping();
        if (config.loyalty.enable === false) return;
        let rank = 1;
        con.query(`SELECT * FROM users WHERE guild_id = ${message.channel.guild.id} ORDER BY points DESC`, function (err, result, fields) {
            if (err) console.log(err);
            if (result.length > 0) {
                for (let user of result) {
                    if (user.client_id == message.member.id) {
                        message.reply(`Your Rank: **#${rank}** with **${user.points}** points`);
                        break;
                    } else {
                        rank++;
                    }
                }
            } else {
                message.reply(`404 NOT FOUND!`);
                return;
            }
        });
        message.channel.stopTyping(true);

    }

}

module.exports = RankCommand;