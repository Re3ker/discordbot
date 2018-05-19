const commando = require("discord.js-commando");
const stripIndents = require('common-tags').stripIndents;
class CVNCommand extends commando.Command {

    constructor(client) {
        super(client, {
            name: 'cvn',
            group: 'text',
            memberName: 'cvn',
            description: 'Takes a CVN pattern to create a random word based on your input',
            details: stripIndents `
            [mode]: **decode** or **d** turns a word or phrase into a pattern.
            **encode** or **e** turns a pattern into a random word.
            
            [pattern]: Use V for Vowel - C for consonant - N for number.
            You can use every letter and number in lowercase as placeholders.
            You can also add a ² and it will be replaced with the latest converted character (e.g. C² would be "mm", "tt" and so on)
            
            Example: The pattern **CVVCC** will be **boobs** or something else related to this pattern.
            `,
            args: [{
                    key: 'mode',
                    prompt: 'write "encode" or "decode"',
                    type: 'string',
                    default: 'decode'
                },
                {
                    key: 'pattern',
                    prompt: 'Enter a valid CVN pattern',
                    type: 'string',
                    default: 'CVCV'
                }

            ]

        });
    }

    async run(message, args) {
        message.channel.startTyping();
        var output = "";
        if (args.mode == "decode" || args.mode == "d") {
            var input_chars = args.pattern.split(""),
                v_pat = "aeiouy".split(""),
                c_pat = "bcdfghjklmnpqrstvwxz".split("");
            var last = "";
            for (var i = 0; i < input_chars.length; i++) {
                switch (input_chars[i]) {
                    case "V":
                        {
                            output += last = v_pat[Math.floor(Math.random() * v_pat.length)];
                            break;
                        }
                    case "C":
                        {
                            output += last = c_pat[Math.floor(Math.random() * c_pat.length)];
                            break;
                        }
                    case "N":
                        {
                            output += last = Math.floor(Math.random() * 10);
                            break;
                        }
                    case "²":
                        {
                            output += last;
                            break;
                        }
                    case " ":
                        {
                            output += " ";
                            break;
                        }
                    default:
                        output += input_chars[i];
                }
            }
            message.channel.send(`Decoded: **${output}**`);
        } else if (args.mode == "encode" || args.mode == "e") {
            var input_chars = args.pattern.split(""),
                v_pat = "aeiouy",
                c_pat = "bcdfghjklmnpqrstvwxz";
            var last = "";
            var output = "";
            for (var i = 0; i < input_chars.length; i++) {
                if (v_pat.indexOf(input_chars[i].toLowerCase()) > -1 && input_chars[i] != last && input_chars[i] != " ") {
                    output += "V";
                } else if (c_pat.indexOf(input_chars[i].toLowerCase()) > -1 && input_chars[i] != last && input_chars[i] != " ") {
                    output += "C";
                } else if (!isNaN(Number(input_chars[i])) && input_chars[i] != last && input_chars[i] != " ") {
                    output += "N";
                } else if (input_chars[i] == last) {
                    output += "²";
                } else if (input_chars[i] == " ") {
                    output += " ";
                }
                last = input_chars[i];
            }
            message.channel.send(`Encoded: **${output}**`);
        }
        message.channel.stopTyping(true);
    }

}

module.exports = CVNCommand;