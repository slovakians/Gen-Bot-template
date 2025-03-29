const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add')
        .setDescription('Add an account or item to the stock')
        .addStringOption(option =>
            option.setName('service')
                .setDescription('The service name (e.g., Xbox, Steam)')
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

        const stockFolder = path.join(__dirname, 'Stock');
        const filePath = path.join(stockFolder, `${service}.txt`);

        // Check if the service exists
        if (!fs.existsSync(filePath)) {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('#ff0000')
                        .setTitle('❌ Service Not Found')
                        .setDescription(`The service **${service}** does not exist.\nUse **/create** to add it first!`)
                ],
                ephemeral: true
            });
        }

        // Append the account/item to the file
        fs.appendFileSync(filePath, `${account}\n`);

        // Embed confirmation
        const embed = new EmbedBuilder()
            .setColor('#00ff00')
            .setTitle('✅ Account Added to Stock')
            .addFields(
                { name: '🔹 Service', value: `${service.charAt(0).toUpperCase() + service.slice(1)}`, inline: true },
                { name: '🔹 Account', value: `\`${account}\``, inline: false }
            )
            .setFooter({ text: 'Stock updated successfully!' });

        await interaction.reply({ embeds: [embed] });
    }
};
