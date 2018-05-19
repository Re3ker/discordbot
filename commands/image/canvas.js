const commando = require("discord.js-commando");
const stripIndents = require('common-tags').stripIndents;
const c = require('canvas');
const http = require('https');
class CanvasCommand extends commando.Command {
    // THIS IS FOR TESTS ONLY
    constructor(client) {
        super(client, {
            name: 'canvas',
            group: 'image',
            memberName: 'canvas',
            description: 'Testing usage of canvas',
            args: [{
                key: 'text',
                prompt: 'Your text',
                type: 'string',
                default: "AHHH, NO TEXT GIVEN!!!"
            }]
        });

    }

    async run(message, args) {
        const canvas = c.createCanvas(400, 225)
        const ctx = canvas.getContext('2d')
        let fontSize = 30;
        ctx.fillStyle = 'rgba(54,57,62,1)';
        ctx.font = fontSize + 'px Arial';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        let text = ctx.measureText(args.text);
        ctx.fillStyle = 'rgba(255,255,255,1)';
        ctx.fillText(args.text, (canvas.width / 2) - (text.width / 2), (canvas.height / 2) + fontSize / 2);

        let buffer = canvas.toBuffer();
        message.channel.send("", {
            file: buffer // Or replace with FileOptions object
        });
    }
}

module.exports = CanvasCommand;