const commando = require("discord.js-commando");
const stripIndents = require('common-tags').stripIndents;
let start_timestamp;
class UptimeCommand extends commando.Command {

    constructor(client) {
        super(client, {
            name: 'uptime',
            group: 'util',
            memberName: 'uptime',
            description: 'Time since the bot is online'
        });
        start_timestamp = new Date().getTime();
    }

    async run(message, args) {
        message.channel.startTyping();
        let bot_time = this.niceTime();
        message.reply(`Up since ${bot_time}`);
        message.channel.stopTyping(true);
    }

    niceTime() {
        let current_timestamp = new Date().getTime();
        var sec_num = Math.abs(current_timestamp - start_timestamp) / 1000;
        var days = Math.floor(sec_num / 86400);
        sec_num -= days * 86400;
        var hours = Math.floor(sec_num / 3600) % 24;
        sec_num -= hours * 3600;
        var minutes = Math.floor(sec_num / 60) % 60;
        sec_num -= minutes * 60;
        var seconds = Math.floor(sec_num % 60);
        let output_string = `${seconds.toString()} ${(seconds != 1) ? 'seconds' : 'second' }`;
        if (minutes > 0 || hours > 0 || days > 0) {
            output_string = `${minutes.toString()} ${(minutes != 1) ? 'minutes' : 'minute' } and ${output_string}`;
        }
        if (hours > 0 || days > 0) {
            output_string = `${hours.toString()} ${(hours != 1) ? 'hours' : 'hour' }, ${output_string}`;
        }
        if (days > 0) {
            output_string = `${days.toString()} ${(days != 1) ? 'days' : 'day' }, ${output_string}`;
        }

        return output_string;
    }


}

module.exports = UptimeCommand;