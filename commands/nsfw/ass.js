const config = require(__basedir + '/config.json');
const commando = require("discord.js-commando");
const Swagger = require('swagger-client');
const {
    RichEmbed
} = require('discord.js');
class AssCommand extends commando.Command {

    constructor(client) {
        super(client, {
            name: 'ass',
            group: 'nsfw',
            memberName: 'ass',
            description: '[**NSFW**] Gets a random ass image',
            nsfw: true
        });
    }

    async run(message, args) {
        message.channel.startTyping();
        if (message.channel.nsfw === false) {
            message.channel.send(":no_entry: `This command can only be used in NSFW channels`");
            message.channel.stopTyping(true);
            return;
        }

        let url = "http://api.obutts.ru/noise/50/";
        const request = {
            url: url
        }
        Swagger.http(request)
            .then((res) => {
                let obj = JSON.parse(res.text);
                let arrayRandom = Math.floor(Math.random() * obj.length);
                let embed = new RichEmbed()
                    .setColor(config.bot.color)
                    .setImage(`http://media.obutts.ru/${obj[arrayRandom].preview}`)
                message.channel.send(embed);
            })
            .catch((err) => {
                console.log(err);
                console.log(err.response);
            });
        message.channel.stopTyping(true);
    }
}

module.exports = AssCommand;