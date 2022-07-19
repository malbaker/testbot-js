const fs = require('node:fs');
const path = require('node:path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
// TO BE USED WHEN RUNNING LOCALLY
// const { clientId, testguildId, csguildId, token } = require('./config.json');

// Exporting commands
const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    commands.push(command.data.toJSON());
}
/*
	Deploying commands to servers with djs rest protocol
*/

const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);
// const rest = new REST({ version: '9' }).setToken(token);


rest.put(Routes.applicationGuildCommands(process.env.clientID, process.env.testID), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);

rest.put(Routes.applicationGuildCommands(process.env.clientID, process.env.csID), { body: commands })
.then(() => console.log('Successfully registered application commands.'))
.catch(console.error);


// LOCAL TESTING
/* rest.put(Routes.applicationGuildCommands(clientId, testguildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);

rest.put(Routes.applicationGuildCommands(clientId, csguildId), { body: commands })
.then(() => console.log('Successfully registered application commands.'))
.catch(console.error); */