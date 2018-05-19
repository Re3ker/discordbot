const config = require(__basedir + '/config.json');
const commando = require("discord.js-commando");
const stripIndents = require('common-tags').stripIndents;
const {
    RichEmbed
} = require('discord.js');
const gen = require('random-seed');
class CVNCommand extends commando.Command {

    constructor(client) {
        super(client, {
            name: 'how',
            group: 'fun',
            memberName: 'how',
            description: 'Find out how much you are something...',
            args: [{
                key: 'term',
                prompt: 'write anything you wanna you on test',
                type: 'string'
            }]
        });
    }

    async run(message, args) {
        let term = args.term;
        let memberID = message.member.id;
        let seed = memberID + term.toString().toLowerCase();
        let rand = gen.create(seed);
        let returnText = `You are to **${rand.intBetween(0, 100)}%** ${term}`;
        let embed = new RichEmbed()
            .setColor(config.bot.color)
            .setAuthor(message.author.username, message.author.avatarURL)
            .setDescription(returnText)
        message.channel.send(embed);
    }
}

module.exports = CVNCommand;