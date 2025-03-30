const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('create')
        .setDescription('Create a new service and add it to stock.')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('The name of the new service (e.g., Netflix, Steam, Xbox)')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('type')
                .setDescription('Choose Free')
                .setRequired(true)
                .addChoices(
                    { name: '🆓 Free', value: 'free' }
                )
        ),
    async execute(interaction) {
        const member = interaction.member;
        const service = interaction.options.getString('name').toLowerCase();

        // Get role settings from config
        const freeRole = config.freeRole || null;

        // Check if the user has permission (skip if no role is set)
        if (freeRole && !member.roles.cache.has(freeRole)) {
            return interaction.reply({ content: '❌ You do not have permission to create **Free** services!', ephemeral: true });
        }

        // Set stock folder inside `commands/Stock/Free`
        const stockFolder = path.join(__dirname, 'Stock', 'Free');

        // Ensure the stock folder exists
        if (!fs.existsSync(stockFolder)) {
            fs.mkdirSync(stockFolder, { recursive: true });
        }

        const filePath = path.join(stockFolder, `${service}.txt`);

        // Check if service already exists
        if (fs.existsSync(filePath)) {
            return interaction.reply({ content: `⚠️ The service **${service}** already exists in stock!`, ephemeral: true });
        }

        // Create the service file
        fs.writeFileSync(filePath, '', 'utf8');

        // Send confirmation embed
        const embed = new EmbedBuilder()
            .setColor('#2b2d31')
            .setTitle('✅ Service Created')
            .addFields(
                { name: '🔹 Service Name', value: `${service.charAt(0).toUpperCase() + service.slice(1)}`, inline: true },
                { name: '🔹 Type', value: '🆓 Free', inline: true }
            )
            .setFooter({ text: 'TEST G3N - Service successfully created!' });

        await interaction.reply({ embeds: [embed] });
    }
};
