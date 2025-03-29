const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stock')
        .setDescription('View the current stock'),
    async execute(interaction) {
        const freePath = './commands/Stock/Free/';
        const premiumPath = './commands/Stock/Premium/';

        let freeStock = '';
        let premiumStock = '';

        // Read Free stock
        if (fs.existsSync(freePath)) {
            const freeFiles = fs.readdirSync(freePath).filter(file => file.endsWith('.txt'));
            freeFiles.forEach(file => {
                const serviceName = path.basename(file, '.txt');
                const count = fs.readFileSync(`${freePath}/${file}`, 'utf-8').split('\n').filter(line => line.trim() !== '').length;
                freeStock += `✅ **${serviceName}:** ${count}\n`;
            });
        }

        // Read Premium stock
        if (fs.existsSync(premiumPath)) {
            const premiumFiles = fs.readdirSync(premiumPath).filter(file => file.endsWith('.txt'));
            premiumFiles.forEach(file => {
                const serviceName = path.basename(file, '.txt');
                const count = fs.readFileSync(`${premiumPath}/${file}`, 'utf-8').split('\n').filter(line => line.trim() !== '').length;
                premiumStock += `💎 **${serviceName}:** ${count}\n`;
            });
        }

        const embed = new EmbedBuilder()
            .setColor('#2b2d31')
            .setTitle('📦 NUKE G3N Service Stock')
            .setDescription('👋 Welcome to **NUKE G3N!** 🚀 We are here to provide you with the best services.')
            .addFields(
                { name: '**Free Services**', value: freeStock || 'No free stock available.', inline: true },
                { name: '**Premium Services**', value: premiumStock || 'No premium stock available.', inline: true }
            )
            .addFields({ name: '**Useful Links**', value: '[Website](https://yourwebsite.com) | [Discord](https://discord.gg/yourserver)' })
            .setFooter({ text: 'Made by ⌈❗⌋ YourName', iconURL: 'https://youriconurl.com/icon.png' });

        await interaction.reply({ embeds: [embed] });
    }
};
