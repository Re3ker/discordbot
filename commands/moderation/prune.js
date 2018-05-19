const commando = require("discord.js-commando");
const stripIndents = require('common-tags').stripIndents;
const c = require('canvas');
const http = require('https');
class PruneCommand extends commando.Command {

    constructor(client) {
        super(client, {
            name: 'prune',
            group: 'moderation',
            memberName: 'prune',
            description: 'Testing usage of canvas',
            args: [{
                key: 'amount',
                prompt: 'Amount of messages to delete',
                type: 'integer',
                default: 10
            }]
        });

    }

    async run(message, args) {
        if (this.checkPermission(message.member) !== true) return message.channel.send(":warning: `you can't do this`");
        if (this.checkPermission(message.guild.me) !== true) return message.channel.send(":warning: `I can't do this`");

        message.channel.fetchMessages({
            limit: args.amount
        }).then(messages => {
            messages.forEach(msg => {
                this.deleteMessage(msg);
            });
        });
    }

    deleteMessage(message) {
        message.delete()
            .then(msg => console.log(`Deleted message from ${msg.author.username}`))
            .catch(console.error);
    }

    checkPermission(member) {
        if (member.permissions.has("MANAGE_MESSAGES", true)) {

            return true;
        } else {

            return false;
        }
    }

}

module.exports = PruneCommand;