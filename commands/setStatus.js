const { SlashCommandBuilder } = require('@discordjs/builders');

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
                    if (interaction.member.permissions.has('MANAGE_MESSAGES') && interaction.guild.me.permissions.has('MANAGE_MESSAGES')) {
                        await interaction.client.user.setPresence({ activities: [{ name:`${status}`, type: 'PLAYING' }], status: 'online' });
                        await interaction.reply({ content:'Set bot status', ephemeral:true });
                    }
                    else if (interaction.member.permissions.has('MANAGE_MESSAGES') === false) {
                        interaction.reply({ content:'You do not have the **Manage Messages** permission.', ephemeral: true });
                    }
                },
};