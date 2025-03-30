const { Client, GatewayIntentBits, Collection, ActivityType, REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('./config.json');

// Create bot client
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Load commands
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

const commands = [];
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON());
}

// Register Slash Commands to a Specific Guild
const rest = new REST({ version: '10' }).setToken(config.token);
const guildId = config.guildId; // Ensure you have "guildId" in config.json

(async () => {
    try {
        console.log('🔄 Refreshing slash commands...');
        await rest.put(Routes.applicationGuildCommands(config.clientId, guildId), { body: commands });
        console.log(`✅ Successfully registered commands to guild: ${guildId}`);
    } catch (error) {
        console.error('❌ Error registering commands:', error);
    }
})();

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
