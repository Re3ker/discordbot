const config = require(__basedir + '/config.json');
const commando = require("discord.js-commando");
const Swagger = require('swagger-client');
const {
    RichEmbed
} = require('discord.js');
class DefinitionCommand extends commando.Command {

    constructor(client) {
        super(client, {
            name: 'definition',
            aliases: ['def'],
            group: 'text',
            memberName: 'definition',
            description: 'Get the definition of a word',
            args: [{
                key: 'word',
                prompt: 'Enter a word you want a definition for',
                type: 'string',
            }, ]
        });
    }

    async run(message, args) {
        message.channel.startTyping();
        let tag = args.word.replace(/ /g, "_").toLowerCase()
        let url = `http://api.wordnik.com:80/v4/word.json/${tag}/definitions?limit=1&includeRelated=false&sourceDictionaries=all&useCanonical=false&includeTags=false&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5`

        const request = {
            url: url
        }

        Swagger.http(request)
            .then((res) => {
                this.gotData(res.body, message, args.word);
            })
            .catch((err) => {
                console.log(err);
                console.log(err.response);
            });

        message.channel.stopTyping(true);
    }

    gotData(data, message, word) {
        if (typeof data[0] === 'undefined') {
            return message.reply(`Can't find a definition of **${word}**. Only use one word`);
        }
        let embed = new RichEmbed()
            .setColor(config.bot.color)
            .addField(`Definition of '${data[0].word}':`, data[0].text)
            .setFooter(`Dictionary: ${data[0].sourceDictionary}`, config.bot.avatar);
        message.channel.send(embed);
    }
}

module.exports = DefinitionCommand;