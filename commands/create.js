const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('create')
        .setDescription('Create a new service in stock')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('The service name (e.g., Xbox, Steam)')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('type')
                .setDescription('The service type (Only Free is allowed)')
                .setRequired(true)
                .addChoices({ name: 'Free', value: 'Free' }) // Only "Free" is allowed
        ),
    async execute(interaction) {
        const service = interaction.options.getString('name').toLowerCase();
        const type = interaction.options.getString('type');

        const stockFolder = path.join(__dirname, 'Stock');
        const filePath = path.join(stockFolder, `${service}.txt`);

        // Check if the Stock folder exists, if not, create it
        if (!fs.existsSync(stockFolder)) {
            fs.mkdirSync(stockFolder, { recursive: true });
        }

        // Check if the file already exists
        if (fs.existsSync(filePath)) {
            return await interaction.reply({ content: `⚠️ The service **${service}** already exists in stock!`, ephemeral: true });
        }

        // Create the new service file
        fs.writeFileSync(filePath, ''); // Empty file

        await interaction.reply(`✅ Service **${service}** has been created successfully as **${type}**.`);
    }
};
