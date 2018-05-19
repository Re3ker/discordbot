const commando = require("discord.js-commando");
const stripIndents = require('common-tags').stripIndents;
class VaporCommand extends commando.Command {

    constructor(client) {
        super(client, {
            name: 'vapor',
            group: 'text',
            memberName: 'vapor',
            description: 'Vaporwave!',
            args: [{
                    key: 'phrase',
                    prompt: 'Your Text',
                    type: 'string'
                }

            ]
        });
    }

    async run(message, args) {
        message.channel.startTyping();
        message.channel.send(this.vaporize(args.phrase));
        message.channel.stopTyping(true);
    }

    vaporize(text) {
        var map = {
            " ": "　",
            "`": "`",
            "1": "１",
            "2": "２",
            "3": "３",
            "4": "４",
            "5": "５",
            "6": "６",
            "7": "７",
            "8": "８",
            "9": "９",
            "0": "０",
            "-": "－",
            "=": "＝",
            "~": "~",
            "!": "！",
            "@": "＠",
            "#": "＃",
            "$": "＄",
            "%": "％",
            "^": "^",
            "&": "＆",
            "*": "＊",
            "(": "（",
            ")": "）",
            "_": "_",
            "+": "＋",
            "q": "ｑ",
            "w": "ｗ",
            "e": "ｅ",
            "r": "ｒ",
            "t": "ｔ",
            "y": "ｙ",
            "u": "ｕ",
            "i": "ｉ",
            "o": "ｏ",
            "p": "ｐ",
            "[": "[",
            "]": "]",
            "\\": "\\",
            "Q": "Ｑ",
            "W": "Ｗ",
            "E": "Ｅ",
            "R": "Ｒ",
            "T": "Ｔ",
            "Y": "Ｙ",
            "U": "Ｕ",
            "I": "Ｉ",
            "O": "Ｏ",
            "P": "Ｐ",
            "{": "{",
            "}": "}",
            "|": "|",
            "a": "ａ",
            "s": "ｓ",
            "d": "ｄ",
            "f": "ｆ",
            "g": "ｇ",
            "h": "ｈ",
            "j": "ｊ",
            "k": "ｋ",
            "l": "ｌ",
            ";": "；",
            "'": "＇",
            "A": "Ａ",
            "S": "Ｓ",
            "D": "Ｄ",
            "F": "Ｆ",
            "G": "Ｇ",
            "H": "Ｈ",
            "J": "Ｊ",
            "K": "Ｋ",
            "L": "Ｌ",
            ":": "：",
            "\"": "\"",
            "z": "ｚ",
            "x": "ｘ",
            "c": "ｃ",
            "v": "ｖ",
            "b": "ｂ",
            "n": "ｎ",
            "m": "ｍ",
            ",": "，",
            ".": "．",
            "/": "／",
            "Z": "Ｚ",
            "X": "Ｘ",
            "C": "Ｃ",
            "V": "Ｖ",
            "B": "Ｂ",
            "N": "Ｎ",
            "M": "Ｍ",
            "<": "<",
            ">": ">",
            "?": "？"
        };
        var charArray = text.split("");
        for (var i = 0; i < charArray.length; i++) {
            if (map[charArray[i].toLowerCase()]) {
                charArray[i] = map[charArray[i]];
            }
        }
        text = charArray.join("");
        return text;
    }

}

module.exports = VaporCommand;