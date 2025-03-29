const { Client, GatewayIntentBits, Collection, ActivityType } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('./config.json');

// Create bot client
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Load commands
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.data.name, command);
}

// Event: Bot Ready
client.once('ready', () => {
    console.log(`✅ Logged in as ${client.user.tag}`);

    // Set bot status
    client.user.setPresence({
        activities: [{ name: '📌 Made By YourName', type: ActivityType.Playing }],
        status: 'online' // Other options: 'idle', 'dnd', 'invisible'
    });
});

// Event: Handle Slash Commands
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: '❌ There was an error executing this command!', ephemeral: true });
    }
});

// Login the bot
client.login(config.token);
