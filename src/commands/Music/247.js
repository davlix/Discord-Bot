// Dependencies
const Command = require('../../structures/Command.js');

module.exports = class TwentyFourSeven extends Command {
	constructor(bot) {
		super(bot, {
			name: '247',
			dirname: __dirname,
			aliases: ['stay', '24/7'],
			botPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'SPEAK'],
			description: 'Stays in the voice channel even if no one is in it.',
			usage: '24/7',
			cooldown: 3000,
			slash: true,
		});
	}

	// Function for message command
	async run(bot, message, settings) {
		// Check if the member has role to interact with music plugin
		if (message.guild.roles.cache.get(settings.MusicDJRole)) {
			if (!message.member.roles.cache.has(settings.MusicDJRole)) {
				return message.channel.error('misc:MISSING_ROLE').then(m => m.timedDelete({ timeout: 10000 }));
			}
		}

		// Check that a song is being played
		const player = bot.manager.players.get(message.guild.id);
		if (!player) return message.channel.error('misc:NO_QUEUE').then(m => m.timedDelete({ timeout: 10000 }));

		// Check that user is in the same voice channel
		if (message.member.voice.channel.id !== player.voiceChannel) return message.channel.error('misc:NOT_VOICE').then(m => m.timedDelete({ timeout: 10000 }));

		// toggle 24/7 mode off and on
		player.twentyFourSeven = !player.twentyFourSeven;
		message.channel.send(message.translate('music/247:RESP', { TOGGLE: player.twentyFourSeven }));
	}

	// Function for slash command
	async callback(bot, interaction, guild) {
		const member = guild.members.cache.get(interaction.user.id),
			channel = guild.channels.cache.get(interaction.channelID);

		// Check if the member has role to interact with music plugin
		if (guild.roles.cache.get(guild.settings.MusicDJRole)) {
			if (!member.roles.cache.has(guild.settings.MusicDJRole)) {
				return bot.send(interaction, [channel.error('misc:MISSING_ROLE', { ERROR: null }, true)], true);
			}
		}

		// Check that a song is being played
		const player = bot.manager.players.get(guild.id);
		if (!player) return bot.send(interaction, [channel.error('misc:NO_QUEUE', { ERROR: null }, true)], true);

		// Check that user is in the same voice channel
		if (member.voice.channel.id !== player.voiceChannel) return bot.send(interaction, [channel.error('misc:NOT_VOICE', { ERROR: null }, true)], true);

		// toggle 24/7 mode off and on
		player.twentyFourSeven = !player.twentyFourSeven;
		await bot.send(interaction, [bot.translate('music/247:RESP', { TOGGLE: player.twentyFourSeven })]);
	}
};
