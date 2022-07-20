const { SlashCommandBuilder } = require('@discordjs/builders');
const staffRoles = require('../utils/staffRoles');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('Set bot status')
        .addStringOption(option =>
            option.setName('status')
                .setDescription('New bot status')
                .setRequired(true)),
    async execute(interaction) {
        const status = interaction.options.getString('status');
        if (status === '') {
            return interaction.reply(
                { content: 'Must be an actual message',
                ephemeral: true },
            );
        }
        if (!interaction.member.roles.cache.some(r => staffRoles.includes(r.id))) {
            return interaction.reply(
                { content: 'You are not allowed to do this',
                ephemeral:true });
        }
        await interaction.client.user.setPresence({ activities: [{ name: `${status}`, type:'PLAYING' }], status:'online' });
        await interaction.reply({ content:'Thanks', ephemeral:true });
    },
};