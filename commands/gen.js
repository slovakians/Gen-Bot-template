const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gen')
        .setDescription('Generate a free account')
        .addStringOption(option =>
            option.setName('service')
                .setDescription('Choose a service (e.g., Xbox, Steam)')
                .setRequired(true)
        ),
    async execute(interaction) {
        const service = interaction.options.getString('service').toLowerCase();
        const filePath = `./commands/Stock/${service}.txt`;

        if (!fs.existsSync(filePath)) {
            return await interaction.reply({ content: '❌ Service not found in stock!', ephemeral: true });
        }

        let accounts = fs.readFileSync(filePath, 'utf-8').split('\n').filter(line => line.trim() !== '');
        if (accounts.length === 0) {
            return await interaction.reply({ content: '❌ No accounts left for this service!', ephemeral: true });
        }

        // Pick a random account
        const randomIndex = Math.floor(Math.random() * accounts.length);
        const selectedAccount = accounts[randomIndex];

        // Remove the used account
        accounts.splice(randomIndex, 1);
        fs.writeFileSync(filePath, accounts.join('\n'));

        // Format the account info with ZWSP
        const formattedAccount = selectedAccount.replace(/./g, '$&\u200B');

        // Send embed in DM
        const embed = new EmbedBuilder()
            .setColor('#2b2d31')
            .setTitle('✅ Generated Free Account')
            .addFields(
                { name: '🔹 Service', value: service.charAt(0).toUpperCase() + service.slice(1), inline: true },
                { name: '🔹 Account', value: `\`\`\`${formattedAccount}\`\`\``, inline: false } // Makes it copyable without triggering Discord filters
            )
            .setFooter({ text: 'Use this account responsibly!' });

        try {
            await interaction.user.send({ embeds: [embed] });
            await interaction.reply({ content: `✅ **Check your DM** ${interaction.user}! If you do not receive the message, please unlock your private messages.` });
        } catch (error) {
            await interaction.reply({ content: '❌ I was unable to send you a DM! Please enable private messages.', ephemeral: true });
        }
    }
};
