const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add')
        .setDescription('Add an account or item to the stock')
        .addStringOption(option =>
            option.setName('service')
                .setDescription('The service name (e.g., Xbox, Steam, Disney+)')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('account')
                .setDescription('The account or item to add (e.g., email:password)')
                .setRequired(true)
        ),
    async execute(interaction) {
        const service = interaction.options.getString('service').toLowerCase();
        const account = interaction.options.getString('account');

        // Check if the service is already stored in Free or Premium
        const freePath = `./commands/Stock/Free/${service}.txt`;
        const premiumPath = `./commands/Stock/Premium/${service}.txt`;

        let folderPath = './commands/Stock/Free/'; // Default to Free

        if (fs.existsSync(premiumPath)) {
            folderPath = './commands/Stock/Premium/'; // If it's already Premium, keep it Premium
        } else if (fs.existsSync(freePath)) {
            folderPath = './commands/Stock/Free/'; // If it's already Free, keep it Free
        } else {
            // If it's a new service, default to Free
            folderPath = './commands/Stock/Free/';
        }

        // Ensure the folder exists
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }

        // Save the account to the correct file
        const filePath = `${folderPath}${service}.txt`;
        fs.appendFileSync(filePath, `${account}\n`);

        // Check if it's in Free or Premium
        const isPremium = folderPath.includes('Premium');

        // Embed confirmation
        const embed = new EmbedBuilder()
            .setColor(isPremium ? '#FFD700' : '#2b2d31') // Gold for Premium, Dark for Free
            .setTitle('✅ Account Added to Stock')
            .addFields(
                { name: '🔹 Service', value: `${service.charAt(0).toUpperCase() + service.slice(1)}`, inline: true },
                { name: '🔹 Account', value: `\`${account}\``, inline: false },
                { name: '🔹 Type', value: isPremium ? 'Premium' : 'Free', inline: true }
            )
            .setFooter({ text: 'Stock updated successfully!' });

        await interaction.reply({ embeds: [embed] });
    }
};
