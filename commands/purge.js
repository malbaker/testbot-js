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
        if (interaction.member.permissions.has('MANAGE_MESSAGES') && interaction.guild.me.permissions.has('MANAGE_MESSAGES')) {
            await interaction.channel.bulkDelete(interaction.options.getInteger('number'));
            await interaction.reply(`Deleted ${interaction.options.getInteger('number')} message(s) successfully.`);
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