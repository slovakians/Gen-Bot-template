const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stock')
        .setDescription('View the current stock'),
    async execute(interaction) {
        const stockPath = path.join(__dirname, 'Stock', 'Free');

        let stockList = '';

        // Read Free stock
        if (fs.existsSync(stockPath)) {
            const stockFiles = fs.readdirSync(stockPath).filter(file => file.endsWith('.txt'));
            stockFiles.forEach(file => {
                const serviceName = path.basename(file, '.txt');
                const count = fs.readFileSync(path.join(stockPath, file), 'utf-8')
                    .split('\n')
                    .filter(line => line.trim() !== '').length;
                stockList += `✅ **${serviceName}:** ${count}\n`;
            });
        }

        const embed = new EmbedBuilder()
            .setColor('#2b2d31')
            .setTitle('📦 TEST G3N Service Stock')
            .setDescription('👋 Welcome to **TEST G3N!** 🚀 Here is our current stock.')
            .addFields(
                { name: '**Free Services**', value: stockList || 'No free stock available.', inline: false }
            )
            .addFields({ name: '**Useful Links**', value: '[Website](https://yourwebsite.com) | [Discord](https://discord.gg/yourserver)' })
            .setFooter({ text: 'Made by ⌈❗⌋ YourName', iconURL: 'https://youriconurl.com/icon.png' });

        await interaction.reply({ embeds: [embed] });
    }
};
