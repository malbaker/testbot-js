const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cs')
        .setDescription('Our Mantra'),
    async execute(interaction) {
        await interaction.reply('Computer Science at Boston University.');
    },
};