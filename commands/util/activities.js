const commando = require("discord.js-commando");
const stripIndents = require('common-tags').stripIndents;

class ActivitiesCommand extends commando.Command {

    constructor(client) {
        super(client, {
            name: 'activities',
            group: 'util',
            memberName: 'activities',
            description: 'List of activities of all guild members'
        });
    }

    async run(message, args) {
        message.channel.startTyping();
        let all_members = message.member.guild.members;
        let all_games = new Array();
        for (let member of all_members) {
            let user = message.guild.members.get(member[0]);
            let userGame = null;
            if (user.presence.game && !user.user.bot) {
                userGame = user.presence.game.name;
                if (all_games.indexOf(userGame) === -1 && userGame.trim() !== "") {
                    all_games.push(userGame.trim());
                }
            }
        }
        all_games.sort((a, b) => {
            if (a < b) return -1;
            if (a > b) return 1;
            return 0;
        });

        let size = 0;
        let chunks = new Array();
        let max_chunk_size = 1800;
        let temp = new Array();
        for (let game in all_games) {

            size += all_games[game].length;

            if (size >= max_chunk_size) {
                size = 0;
                chunks.push(temp);
                temp = new Array();
            }

            temp.push(all_games[game]);

        }
        chunks.push(temp);


        for (let i = 0; i < chunks.length; i++) {
            let msg = `**List of all activities/games played now by guild members** (Page ${i+1})\n`;
            msg += '```\n';
            let list = chunks[i];
            for (let game of list) {
                msg += `${game}\n`;
            }
            msg += '```';
            message.channel.send(msg);
        }
        message.channel.stopTyping(true);
    }

}

module.exports = ActivitiesCommand;