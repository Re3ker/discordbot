const stripIndents = require('common-tags').stripIndents;
const commando = require("discord.js-commando");

class UserInfoCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'user-info',
			aliases: ['user'],
			group: 'util',
			memberName: 'user-info',
			description: 'Gets information about a user.',
			examples: ['user-info @Karto#1133', 'user-info Karto'],
			guildOnly: true,

			args: [{
				key: 'member',
				label: 'user',
				prompt: 'What user would you like to snoop on?',
				type: 'member'
			}]
		});
	}

	async run(msg, args) {
		msg.channel.startTyping();
		const member = args.member;
		const user = member.user;
		return msg.reply(stripIndents `
        
            Info on **${user.username}#${user.discriminator}** (ID: ${user.id})
            
			**❯ Member Details**
			${member.nickname !== null ? ` • Nickname: ${member.nickname}` : ' • No nickname'}
			 • Roles: ${member.roles.map(roles => `\`${roles.name}\``).join(', ')}
             • Joined at: ${member.joinedAt}
             
			**❯ User Details**
             • Created at: ${user.createdAt}
             ${user.bot ? ' • Is a bot account' : ' • Is a user account'}
			 • Status: ${user.presence.status}
             • Game: ${user.presence.game ? user.presence.game.name : 'None'}
             
		`);
		msg.channel.stopTyping(true);
	}
};

module.exports = UserInfoCommand