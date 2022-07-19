const fs = require('node:fs');
const path = require('node:path');
const { Client, Intents, Collection } = require('discord.js');
const replies = require('./utils/pingReplies');
const statusMessages = require('./utils/statusMessages');
require('dotenv').config();

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

// Accepts set of commands from ./commands
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.data.name, command);
}

// Sets custom status when bot runs, status rotates every 15 mins
client.once('ready', () => {
	console.log('It\'s alive!');
    client.user.setPresence({ activities: [{ name: 'CS131 Office Hours', type: 'PLAYING' }], status: 'online' });
    setInterval(() => {
        const newStatus = statusMessages[Math.floor(Math.random() * statusMessages.length)];
        client.user.setPresence({ activities: [{ name:`${newStatus}`, type: 'PLAYING' }], status: 'online' });
    }, 900000);
});

// Custom messages for when the bot is pinged, randomly picked
client.on('messageCreate', (message) => {
    if (message.author.bot) return false;
    if (message.content.includes('@here') || message.content.includes('@everyone') || message.type == 'REPLY') return false;
    if (message.mentions.has(client.user)) {
        message.channel.send(replies[Math.floor(Math.random() * replies.length)]);
    }
});

// Interpreting commands from messages
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    }
    catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error executing this command', ephemeral: true });
    }
});


client.login(process.env.TOKEN);
