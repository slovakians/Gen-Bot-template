const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stock')
        .setDescription('View the current stock'),
    async execute(interaction) {
        const stockPath = './commands/Stock/';
        const files = fs.readdirSync(stockPath).filter(file => file.endsWith('.txt'));

        if (files.length === 0) {
            return await interaction.reply({ content: '❌ No stock available!', ephemeral: true });
        }

        let stockList = '';
        files.forEach(file => {
            const serviceName = path.basename(file, '.txt');
            const count = fs.readFileSync(`${stockPath}/${file}`, 'utf-8').split('\n').filter(line => line.trim() !== '').length;
            stockList += `**${serviceName.charAt(0).toUpperCase() + serviceName.slice(1)}:** ${count}\n`;
        });

        const embed = new EmbedBuilder()
            .setColor('#2b2d31')
            .setTitle('📦 TEST GEN Service Stock')
            .setDescription('👋 Hello and welcome to **NUKE G3N!** 🚀 We are here to provide you with the best services.')
            .addFields({ name: '**Free Services**', value: stockList })
            .addFields({ name: '**Useful Links**', value: '[Website](https://yourwebsite.com) | [Discord](https://discord.gg/yourserver)' })
            .setFooter({ text: 'Made by ⌈❗⌋ YourName', iconURL: 'https://youriconurl.com/icon.png' });

        await interaction.reply({ embeds: [embed] });
    }
};
