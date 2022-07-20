const { SlashCommandBuilder } = require('@discordjs/builders');
const staffRoles = require('../utils/staffRoles');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('Mass deletes messages')
        .addIntegerOption(option =>
            option.setName('number')
                .setDescription('Number of messages to be deleted')
                .setRequired(true)),
    async execute(interaction) {
        const number = interaction.options.getInteger('number');
        if (number <= 1) {
            return interaction.reply(
                { content: 'Must be more than 1 message',
                ephemeral:true });
        }
        if (number > 100) {
            return interaction.reply(
                { content: 'Cannot delete more than 100 messages',
                ephemeral:true });
        }
        if (!interaction.member.roles.cache.some(r => staffRoles.includes(r.id))) {
            return interaction.reply(
                { content:'You do not have the **Manage Messages** permission. Please ask a moderator to give you this permission.',
                ephemeral: true });
        }
        await interaction.channel.bulkDelete(number);
        await interaction.reply(`Deleted ${number} messages successfully.`);
        await setTimeout(() => interaction.deleteReply(), 3000);
    },
};