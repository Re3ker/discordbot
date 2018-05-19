const config = require(__basedir + '/config.json');
const commando = require("discord.js-commando");
const Swagger = require('swagger-client');
const {
    RichEmbed
} = require('discord.js');
class KonaCommand extends commando.Command {

    constructor(client) {
        super(client, {
            name: 'kona',
            group: 'nsfw',
            memberName: 'kona',
            description: '[**NSFW**] Gets an image from konachan',
            nsfw: true,
            args: [{
                key: 'tag',
                prompt: 'search for a tag',
                type: 'string',
                default: 'all'
            }]
        });
    }

    async run(message, args) {
        message.channel.startTyping();
        if (message.channel.nsfw === false) {
            message.channel.send(":no_entry: `This command can only be used in NSFW channels`");
            message.channel.stopTyping(true);
            return;
        }

        let url = "https://konachan.com/post?tags=order%3Arandom";
        if (args.tag !== "all") {
            url = `https://konachan.com/post?tags=order%3Arandom+${args.tag.toLowerCase()}`;
        }

        const request = {
            url: url
        }

        Swagger.http(request)
            .then((res) => {

                let result = res.text;
                let pattern = /<a class="directlink [large|small]\w+" href="([^"]*)">/mgi;
                let matches = result.match(pattern);
                if (matches === null) {
                    message.channel.send(":warning: `Nothing to see here...`");
                    return;
                }
                let item = matches[Math.floor(Math.random() * matches.length)];
                let href = item.match(/href="([^"]*)/)[1];

                let embed = new RichEmbed()
                    .setColor(config.bot.color)
                    .setImage(href)
                message.channel.send(embed);

            })
            .catch((err) => {
                console.log(err);
                console.log(err.response);
            });
        message.channel.stopTyping(true);
    }

    gotData(data, message, word) {
        console.log(data);
    }

    ValidURL(str) {
        var pattern = new RegExp('^(https?:\/\/)?' + // protocol
            '((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|' + // domain name
            '((\d{1,3}\.){3}\d{1,3}))' + // OR ip (v4) address
            '(\:\d+)?(\/[-a-z\d%_.~+]*)*' + // port and path
            '(\?[;&a-z\d%_.~+=-]*)?' + // query string
            '(\#[-a-z\d_]*)?$', 'i'); // fragment locater
        if (!pattern.test(str)) {
            return false;
        } else {
            return true;
        }
    }
}

module.exports = KonaCommand;