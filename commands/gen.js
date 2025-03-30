const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Load config
const configPath = path.resolve(__dirname, '../config.json');
if (!fs.existsSync(configPath)) {
    console.error('❌ Missing config.json! Please create one in the root directory.');
    process.exit(1); // Stop execution if config is missing
}
const config = require(configPath);

const cooldowns = new Map();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gen')
        .setDescription('Generate an account')
        .addStringOption(option =>
            option.setName('service')
                .setDescription('The service name (e.g., Xbox, Steam, Disney+)')
                .setRequired(true)
        ),
    async execute(interaction) {
        const user = interaction.user;
        const member = interaction.member;
        const service = interaction.options.getString('service').toLowerCase();

        // Get role settings from config
        const freeRole = config.freeRole;
        const noCooldownRole = config.noCooldownRole;
        const cooldownTime = config.cooldown * 1000;

        // Check if user has the required role
        if (freeRole && !member.roles.cache.has(freeRole)) {
            return interaction.reply({ content: '❌ You do not have permission to use this command!', ephemeral: true });
        }

        // Cooldown check (unless user has noCooldownRole)
        if (!member.roles.cache.has(noCooldownRole)) {
            const lastUsed = cooldowns.get(user.id) || 0;
            const now = Date.now();
            if (now - lastUsed < cooldownTime) {
                const remaining = ((cooldownTime - (now - lastUsed)) / 1000).toFixed(1);
                return interaction.reply({ content: `⏳ You must wait **${remaining}s** before using this command again!`, ephemeral: true });
            }
            cooldowns.set(user.id, now);
        }

        // Stock file path
        const stockFolder = path.resolve(__dirname, '../commands/Stock/Free/');
        const filePath = path.join(stockFolder, `${service}.txt`);

        if (!fs.existsSync(filePath) || fs.readFileSync(filePath, 'utf-8').trim() === '') {
            return interaction.reply({ content: `❌ No stock available for **${service}**!`, ephemeral: true });
        }

        // Get a random account
        let accounts = fs.readFileSync(filePath, 'utf-8').split('\n').filter(line => line.trim() !== '');
        let account = accounts[Math.floor(Math.random() * accounts.length)];

        // Remove the used account from the file
        accounts = accounts.filter(acc => acc !== account);
        fs.writeFileSync(filePath, accounts.join('\n'));

        // Send confirmation in channel
        const publicEmbed = new EmbedBuilder()
            .setColor('#2b2d31')
            .setTitle('✅ Account Generated')
            .setDescription(`Check your DM ${user}! If you do not receive the message, please unlock your private messages.`)
            .setFooter({ text: 'TEST G3N - Enjoy your account!' });

        await interaction.reply({ embeds: [publicEmbed] });

        // Send account in DM with Click-to-Copy
        const dmEmbed = new EmbedBuilder()
            .setColor('#2b2d31')
            .setTitle('🎁 Generated Account')
            .addFields(
                { name: '🔹 Service', value: `${service.charAt(0).toUpperCase() + service.slice(1)}`, inline: true },
                { name: '🔹 Account', value: `\`\`\`${account}\`\`\``, inline: false }
            )
            .setFooter({ text: 'Enjoy your account!' });

        try {
            await user.send({ embeds: [dmEmbed] });
        } catch (err) {
            console.error('❌ Could not send DM:', err);
        }
    }
};
