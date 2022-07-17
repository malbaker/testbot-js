const { SlashCommandBuilder } = require('@discordjs/builders');

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
            interaction.reply({ content: 'Must be more than 1 message', ephemeral:true });
        }
        if (number > 100) {
            interaction.reply({ content: 'Cannot delete more than 100 messages', ephemeral:true });
        }
        if (interaction.member.permissions.has('MANAGE_MESSAGES') && interaction.guild.me.permissions.has('MANAGE_MESSAGES')) {
            await interaction.channel.bulkDelete(number);
            await interaction.reply(`Deleted ${number} messages successfully.`);
            await setTimeout(() => interaction.deleteReply(), 3000);
        }
        else if (interaction.member.permissions.has('MANAGE_MESSAGES') === false) {
            interaction.reply({ content:'You do not have the **Manage Messages** permission. Please ask a moderator to give you this permission.', ephemeral: true });
        }
        else {
            interaction.reply({ content: 'I have not been given the relevant permissions to do this. Please contact a moderator and ask them to give me the **Manage Messages** permission.', ephemeral: true });
        }
    },
};