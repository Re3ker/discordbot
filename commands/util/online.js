const commando = require("discord.js-commando");
const stripIndents = require('common-tags').stripIndents;

class OnlineCommand extends commando.Command {

    constructor(client) {
        super(client, {
            name: 'online',
            group: 'util',
            memberName: 'online',
            description: 'Number of online members in this guild'
        });

    }

    async run(message, args) {
        message.channel.startTyping();
        let all_members = message.member.guild.members;
        let count = 0;
        for (let member of all_members) {
            count++;
        }
        message.reply(`${message.guild.name} has ${count} online members`);
        message.channel.stopTyping(true);
    }


}

module.exports = OnlineCommand;