const commando = require("discord.js-commando");
const RiveScript = require("rivescript");
let bot;
class ChatCommand extends commando.Command {

    constructor(client) {
        super(client, {
            name: 'chat',
            group: 'ai',
            memberName: 'chat',
            description: 'Write with me. Or nah'
        });

        bot = new RiveScript();
        bot.loadDirectory(__dirname + "/brain", this.loading_done, this.loading_error);
    }

    async run(message, args) {
        var reply = bot.reply("local-user", args);
        message.reply(reply);
    }

    loading_done(batch_num) {
        console.log("Batch #" + batch_num + " has finished loading!");
        bot.sortReplies();
    }

    loading_error(error) {
        console.log("Error when loading files: " + error);
    }


}

module.exports = ChatCommand;