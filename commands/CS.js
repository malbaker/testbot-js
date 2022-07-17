const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('CS')
        .setDescription('Computer Science Quote'),
    async execute(interaction) {
        await interaction.reply('Computer Science at Boston University');
    },
};