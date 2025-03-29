const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Displays the help command'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor('#2b2d31') 
            .setTitle('📌 Help Panel')
            .setDescription('👋 Hello and welcome to **TEST GEN!** 🚀 We are here to provide you with the best services.')
            .addFields(
                { name: '**Commands**', value: '\u200B' }, // Empty line
                { name: '`/help`', value: 'Displays the help command', inline: false },
                { name: '`/create`', value: 'Create a new service', inline: false },
                { name: '`/gen`', value: 'Generate a reward', inline: false },
                { name: '`/add`', value: 'Add a reward to the stock', inline: false },
                { name: '`/stock`', value: 'View the current stock', inline: false }
            )
            .addFields(
                { name: '**Useful Links**', value: '[Website](https://yourwebsite.com) | [Discord](https://discord.gg/yourserver)' }
            )
            .setFooter({ text: 'Made by ⌈❗⌋ YourName', iconURL: 'https://youriconurl.com/icon.png' });

        await interaction.reply({ embeds: [embed] });
    }
};
