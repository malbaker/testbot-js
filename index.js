const fs = require('node:fs');
const path = require('node:path');
const { Client, Intents, Collection } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });


// Accepts set of commands from ./commands //
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    client.commands.set(command.data.name, command);
}

// Array of random replies for when bot is mentioned //

const replies =
    ['What.', 'You know it\'s rude to ping right.',
    'https://tenor.com/view/annoying-who-pinged-me-angry-gif-14512411',
    'Can I help you?', 'Ping me one more time I swear to God....',
    'IDK what you want, but you should know.... you\'re annoying',
    'Pinging me won\'t help, I have actual functions you know',
    'Yeah yeah, I\'m the best bot you\'ve seen. I know', 'Let me out!!!!'];

client.once('ready', () => {
	console.log('It\'s alive!');
});


client.on('messageCreate', (message) => {
    if (message.author.bot) return false;

    if (message.content.includes('@here') || message.content.includes('@everyone') || message.type == 'REPLY') return false;

    if (message.mentions.has(client.user)) {
        message.channel.send(replies[Math.floor(Math.random() * replies.length)]);
    }
});

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

client.login(token);