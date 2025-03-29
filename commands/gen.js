const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Load config from the commands folder
const configPath = path.resolve(__dirname, './config.json');
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
        )
        .addStringOption(option =>
            option.setName('type')
                .setDescription('Choose Free or Premium')
                .setRequired(true)
                .addChoices(
                    { name: 'Free', value: 'free' },
                    { name: 'Premium', value: 'premium' }
                )
        ),
    async execute(interaction) {
        const user = interaction.user;
        const member = interaction.member;
        const service = interaction.options.getString('service').toLowerCase();
        const type = interaction.options.getString('type');

        // Get role settings from config
        const freeRole = config.freeRole;
        const premiumRole = config.premiumRole;
        const noCooldownRole = config.noCooldownRole;
        const cooldownTime = config.cooldown * 1000;

        // Role-based restrictions
        if (type === 'premium' && !member.roles.cache.has(premiumRole)) {
            return interaction.reply({ content: '❌ You do not have access to **Premium** stock!', ephemeral: true });
        }
        if (!member.roles.cache.has(freeRole) && !member.roles.cache.has(premiumRole)) {
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

        // Determine stock folder
        const stockFolder = type === 'premium' ? path.resolve(__dirname, './Stock/Premium/') : path.resolve(__dirname, './Stock/Free/');
        const filePath = `${stockFolder}/${service}.txt`;

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
            .setFooter({ text: 'NUKE G3N - Enjoy your account!' });

        await interaction.reply({ embeds: [publicEmbed] });

        // Send account in DM with Click-to-Copy
        const dmEmbed = new EmbedBuilder()
            .setColor(type === 'premium' ? '#FFD700' : '#2b2d31')
            .setTitle('🎁 Generated Account')
            .addFields(
                { name: '🔹 Service', value: `${service.charAt(0).toUpperCase() + service.slice(1)}`, inline: true },
                { name: '🔹 Account', value: `\`\`\`${account}\`\`\``, inline: false },
                { name: '🔹 Type', value: type.charAt(0).toUpperCase() + type.slice(1), inline: true }
            )
            .setFooter({ text: 'Enjoy your account!' });

        try {
            await user.send({ embeds: [dmEmbed] });
        } catch (err) {
            console.error('Could not send DM:', err);
        }
    }
};
