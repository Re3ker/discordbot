const config = require(__basedir + '/config.json');
const commando = require("discord.js-commando");
const stripIndents = require('common-tags').stripIndents;
const {
    RichEmbed
} = require('discord.js');
const c = require('canvas');
const http = require('https');
class DrawCommand extends commando.Command {

    constructor(client) {
        super(client, {
            name: 'draw',
            group: 'image',
            memberName: 'draw',
            description: 'Draw with code',
            args: [{
                key: 'code',
                prompt: 'code to draw',
                type: 'string',
                default: 'null'
            }, ]
        });

        this.strokeStyle = "#ffffff";
        this.fillStyle = '#ffffff';
        this.lineWidth = 1;
        this.lineCap = "round";

    }

    async run(message, args) {
        const canvas = c.createCanvas(400, 225);
        const ctx = canvas.getContext('2d');

        if (args.code.toLowerCase() == "help") {

            return this.showHelp(message);
        }

        // ==== DEFAULTS ====
        ctx.strokeStyle = this.strokeStyle;
        ctx.fillStyle = this.strokeStyle;
        ctx.lineWidth = this.lineWidth;
        ctx.lineCap = this.lineCap;

        let lines = args.code.split('\n');
        if (lines[0].trim() !== '```' || lines[lines.length - 1].trim() !== '```') {

            return message.reply("Please put your code in a code block");
        }

        lines.splice(0, 1);
        lines.splice(lines.length - 1, 1);

        for (let i = 0; i < lines.length; i++) {
            let method = lines[i].trim();
            if (method.startsWith("line")) {
                if (!this.makeLine(ctx, method)) return message.reply(`Invalid usage of \`line\` method on line **${i+1}**. Example: \`line(0,0,100,100)\``);
            } else if (method.startsWith("rect")) {
                if (!this.makeRect(ctx, method)) return message.reply(`Invalid usage of \`rect\` method on line **${i+1}**. Example: \`rect(0,0,100,100)\``);
            } else if (method.startsWith("fillRect")) {
                if (!this.makeFillRect(ctx, method)) return message.reply(`Invalid usage of \`fillRect\` method on line **${i+1}**. Example: \`fillRect(0,0,100,100)\``);
            } else if (method.startsWith("ellipse")) {
                if (!this.makeEllipse(ctx, method)) return message.reply(`Invalid usage of \`ellipse\` method on line **${i+1}**. Example: \`ellipse(0,0,100)\``);
            } else if (method.startsWith("fillEllipse")) {
                if (!this.makeFillEllipse(ctx, method)) return message.reply(`Invalid usage of \`fillEllipse\` method on line **${i+1}**. Example: \`fillEllipse(0,0,100)\``);
            } else if (method.startsWith("text")) {
                if (!this.makeText(ctx, method)) return message.reply(`Invalid usage of \`text\` method on line **${i+1}**. Example: \`text(0,0,"Hello World")\``);
            } else if (method.startsWith("set font")) {
                if (!this.setFont(ctx, method)) return message.reply(`Invalid usage of \`set font\` method on line **${i+1}**. Example: \`set font = "3px Impact"\``);
            } else if (method.startsWith("set fillStyle")) {
                if (!this.setFillStyle(ctx, method)) return message.reply(`Invalid usage of \`set fillStyle\` method on line **${i+1}**. Example: \`set fillStyle = "#c0ffee"\``);
            } else if (method.startsWith("set strokeStyle")) {
                if (!this.setStrokeStyle(ctx, method)) return message.reply(`Invalid usage of \`set strokeStyle\` method on line **${i+1}**. Example: \`set strokeStyle = "#c0ffee"\``);
            } else if (method.startsWith("set lineWidth")) {
                if (!this.setLineWidth(ctx, method)) return message.reply(`Invalid usage of \`set lineWidth\` method on line **${i+1}**. Example: \`set lineWidth = 5\``);
            }
        }

        let buffer = canvas.toBuffer();
        message.channel.send("Result:", {
            file: buffer
        });

    }

    makeLine(ctx, method) {

        let regex = /line\(\s?([0-9]+)\s?\,\s?([0-9]+)\s?\,\s?([0-9]+)\s?\,\s?([0-9]+)\s?\)$/g;

        if (!regex.test(method)) {

            return false;
        }

        method.replace(regex, function (match, x1, y1, x2, y2) {
            ctx.beginPath();
            ctx.lineTo(parseInt(x1), parseInt(y1));
            ctx.lineTo(parseInt(x2), parseInt(y2));
            ctx.stroke();
        });

        return true;
    }

    makeRect(ctx, method) {
        let regex = /rect\(\s?([0-9]+)\s?\,\s?([0-9]+)\s?\,\s?([0-9]+)\s?\,\s?([0-9]+)\s?\)$/g;
        if (!regex.test(method)) {

            return false;
        }

        method.replace(regex, function (match, x, y, w, h) {
            ctx.rect(parseInt(x), parseInt(y), parseInt(w), parseInt(h));
            ctx.stroke();
        });

        return true;
    }

    makeFillRect(ctx, method) {
        let regex = /fillRect\(\s?([0-9]+)\s?\,\s?([0-9]+)\s?\,\s?([0-9]+)\s?\,\s?([0-9]+)\s?\)$/g;
        if (!regex.test(method)) {

            return false;
        }

        method.replace(regex, function (match, x, y, w, h) {
            ctx.fillRect(parseInt(x), parseInt(y), parseInt(w), parseInt(h));
        });

        return true;
    }

    makeEllipse(ctx, method) {
        let regex = /ellipse\(\s?([0-9]+)\s?\,\s?([0-9]+)\s?\,\s?([0-9]+)\s?\s?\)$/g;
        if (!regex.test(method)) {

            return false;
        }

        method.replace(regex, function (match, x, y, r) {
            ctx.beginPath();
            ctx.arc(parseInt(x), parseInt(y), parseInt(r), 0, 2 * Math.PI);
            ctx.stroke();
        });

        return true;
    }

    makeFillEllipse(ctx, method) {
        let regex = /fillEllipse\(\s?([0-9]+)\s?\,\s?([0-9]+)\s?\,\s?([0-9]+)\s?\s?\)$/g;
        if (!regex.test(method)) {

            return false;
        }

        method.replace(regex, function (match, x, y, r) {
            ctx.beginPath();
            ctx.arc(parseInt(x), parseInt(y), parseInt(r), 0, 2 * Math.PI);
            ctx.fill();
        });

        return true;
    }

    makeText(ctx, method) {
        let regex = /text\(\s?(\d+)\s?,\s?(\d+)\s?,\s?\"([^"]+)\"\s?\)$/g;
        if (!regex.test(method)) {

            return false;
        }
        method.replace(regex, function (match, x, y, text) {
            ctx.fillText(text, parseInt(x), parseInt(y));
        });

        return true;
    }

    setFont(ctx, method) {
        let regex = /set font\s?=\s?"([0-9a-zA-Z\s]+)"$/g;
        if (!regex.test(method)) {

            return false;
        }
        method.replace(regex, function (match, style) {
            ctx.font = style;
        });

        return true;
    }

    setFillStyle(ctx, method) {
        let regex = /set fillStyle\s?=\s?"([^"]+)"$/g;
        if (!regex.test(method)) {

            return false;
        }
        method.replace(regex, function (match, style) {
            ctx.fillStyle = style;
        });

        return true;
    }

    setStrokeStyle(ctx, method) {
        let regex = /set strokeStyle\s?=\s?"([^"]+)"$/g;
        if (!regex.test(method)) {

            return false;
        }
        method.replace(regex, function (match, style) {
            ctx.strokeStyle = style;
        });

        return true;
    }

    setLineWidth(ctx, method) {
        let regex = /set lineWidth\s?=\s?([0-9]+)$/g;
        if (!regex.test(method)) {

            return false;
        }
        method.replace(regex, function (match, w) {
            ctx.lineWidth = w;
        });

        return true;
    }

    showHelp(message) {

        let helpMethods = stripIndents `
        **line** - Creates a line at given x and y position of both points.
        Usage: \`line(x1, y1, x2, y2)\`

        **rect** - Creates an outline Rectangle with given position, width and height.
        Usage: \`rect(x, y, width, height)\`

        **fillRect** - Creates an filled Rectangle with given position, width and height.
        Usage: \`fillRect(x, y, width, height)\`

        **ellipse** - Creates an outline Circle with given center position and radius.
        Usage: \`ellipse(x, y, radius)\`

        **fillEllipse** - Creates an filled Circle with given center position and radius.
        Usage: \`fillEllipse(x, y, radius)\`

        **text** - Creates a text with given position and text.
        Usage: \`text(x, y, text)\`

        `;

        let helpSetters = stripIndents `
        *Before using any method, you can set the styling of the elements you create afterwards.
        Colors can be set as names (red, blue, green, etc), rgb(a) and hex.*

        **set font** - sets the font style.
        Usage \`font = "30px Impact"\`

        **set fillStyle** - sets the fill style (background) of the following elements (fillRect, fillEllipse, text).
        Usage: \`set fillStyle = "color"\`

        **set strokeStyle** - sets the stroke(border) style of the following elements (rect, ellipse, line).
        Usage: \`set strokeStyle = "color"\`

        **set lineWidth** - sets the line with of the next line(s).
        Usage: \`set lineWidth = width\`
        `;



        let embed = new RichEmbed()
            .setTitle("Drawing help")
            .addField("Methods", helpMethods)
            .addField("Setters", helpSetters)
            .setColor(config.bot.color)
        return message.channel.send(embed);
    }
}

module.exports = DrawCommand;