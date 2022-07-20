const { SlashCommandBuilder } = require('@discordjs/builders');
const staffRoles = require('../utils/staffRoles');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Send message through the bot')
        .addStringOption(option =>
            option.setName('message')
            .setDescription('Message to be sent')
            .setRequired(true)),
            async execute(interaction) {
                const botMessage = interaction.options.getString('message');
                if (!interaction.member.roles.cache.some(r => staffRoles.includes(r.id))) {
                    return interaction.reply(
                        { content: 'You are not allowed to do this',
                        ephemeral:true });
                    }
                return interaction.channel.send(`${ botMessage }`);
    },
};