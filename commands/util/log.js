const commando = require("discord.js-commando");
const stripIndents = require('common-tags').stripIndents;
const fs = require('fs');
class LogCommand extends commando.Command {
    // MAY NEED USAGE RESTRICTIONS!!!
    constructor(client) {
        super(client, {
            name: 'log',
            group: 'util',
            memberName: 'log',
            description: 'Returns logged messages of the current channel',
            args: [{
                key: 'lines',
                prompt: 'How many lines to you want to receive',
                type: 'integer',
                default: 5,
                max: 50
            }]

        });

    }

    async run(message, args) {

        let mID = message.member.id;
        if (mID !== "90578600432013312" && mID !== "303294917986353152") return message.member.send("Nuuuuu :3");

        let file_path = `${__basedir}/logs/${message.channel.id}.log`;
        if (!fs.existsSync(file_path)) {

            return message.reply("What?");
        }
        let lines;


        const readFile = filePath => new Promise((resolve, reject) => {
            fs.readFile(filePath, (err, data) => {
                if (err) reject(err);
                else resolve(data);
            });
        })

        readFile(file_path).then(data => {
            lines = data.toString().split("\n");
            lines.reverse();
            let new_lines = [];
            if (lines.length >= args.lines) {
                for (let i = 0; i < args.lines; i++) {
                    new_lines.push(lines[i]);
                }
            } else {
                for (let i = 0; i < lines.length; i++) {
                    new_lines.push(lines[i]);
                }
            }
            new_lines.reverse();
            let output = "";
            let upcount = 0;
            let iteration = 1;
            console.log(new_lines.length);
            for (let i = 0; i < new_lines.length; i++) {
                if (upcount < 5) {
                    output += "\n" + new_lines[i].replace(/\`.+/, '');
                    upcount++;
                } else {
                    this.sendLog(message, output, iteration);
                    upcount = 0;
                    iteration++;
                    output = "\n" + new_lines[i].replace(/\`.+/, '');
                }

            }
            if (output !== "") {
                this.sendLog(message, output, iteration + 1);
            }
        }).catch(err => {
            throw err;
        });
    }

    sendLog(message, log, iteration) {

        setTimeout(function () {
            message.member.send(stripIndents `
            \`\`\`
            ${log}
            \`\`\`
            `);
        }, 1000 * iteration);

    }



}

module.exports = LogCommand;