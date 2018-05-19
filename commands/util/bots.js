const commando = require("discord.js-commando");
const stripIndents = require('common-tags').stripIndents;

class BotsCommand extends commando.Command {

    constructor(client) {
        super(client, {
            name: 'bots',
            group: 'util',
            memberName: 'bots',
            description: 'List of all bots on this guild'
        });

    }

    async run(message, args) {
        message.channel.startTyping();
        let all_members = message.member.guild.members;
        let bots = [];
        for (let member of all_members) {

            let instance = message.guild.members.get(member[0]);

            if (instance.user.bot) {
                bots.push(`${instance.user.username} ${(instance.presence.game) ? ` | ${instance.presence.game.name}` : `` }` );
            }
        }

        bots.sort((a, b) => {
            if (a < b) return -1;
            if (a > b) return 1;
            return 0;
        });

        let msg = `**List of all bots** (${bots.length} bots)`;
        msg += '```css\n';
        for (let i = 0; i < bots.length; i++) {

            msg += `${bots[i]}\n`;

        }
        msg += '```';
        message.channel.send(msg);
        message.channel.stopTyping(true);
    }


}

module.exports = BotsCommand;