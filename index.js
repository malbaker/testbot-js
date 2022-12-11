const fs = require('node:fs');
const path = require('node:path');
// const Keyv = require('keyv');
const { Client, Events, GatewayIntentBits, Partials, Collection } = require('discord.js');
const replies = require('./utils/pingReplies');
const statusMessages = require('./utils/statusMessages');
const felizNavidad = require('./utils/felizNavidad');
require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

client.commands = new Collection();

// Keyv database connection (saving for later)
/* const keyv = new Keyv('sqlite://utils/db/db.sqlite');
keyv.on('error', err => console.error('Keyv connection error:', err)); */

// Accepts set of commands from ./commands
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}
// Sets custom status when bot runs, status rotates every 15 mins
client.once(Events.ClientReady, async (c) => {
	console.log(`It\'s alive! Logged in as ${c.user.tag}`);
	const status = felizNavidad[Math.floor(Math.random() * felizNavidad.length)];
    await setInterval(() => {
        // const newStatus = statusMessages[Math.floor(Math.random() * statusMessages.length)];
		const felizStatus = felizNavidad[Math.floor(Math.random() * felizNavidad.length)];
        client.user.setPresence({ activities: [felizStatus], status: 'online' });
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
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});


client.login(process.env.TOKEN);
