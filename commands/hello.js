const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hello')
        .setDescription('Gives a kind greeting'),
    async execute(interaction) {
        await interaction.reply('Hello there friend!');
    },
};