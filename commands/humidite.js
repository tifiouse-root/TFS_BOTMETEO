const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('humidite')
        .setDescription('Obtenez l\'humidité actuelle d\'une ville')
        .addStringOption(option =>
            option.setName('ville')
                .setDescription('La ville pour laquelle vous voulez connaître l\'humidité')
                .setRequired(true)),
    async execute(interaction, weatherAPIKey) {
        const city = interaction.options.getString('ville');
        try {
            const response = await axios.get('https://api.weatherapi.com/v1/current.json', {
                params: {
                    key: weatherAPIKey,
                    q: city,
                    lang: 'fr',
                }
            });

            const humidity = response.data.current.humidity;

            const embed = new EmbedBuilder()
                .setColor('#E5E510')
                .setTitle(`Humidité à **${city}**`)
                .setDescription(`Le taux d'humidité à **${city}** est de **${humidity}%**.`)
                .setTimestamp()
                .setFooter({ text: 'BY TIFIOUSE', iconURL: 'https://cdn.discordapp.com/avatars/1266873308268331200/e47ac9ea924d042ce1f84dd91e7c327f.png?size=128' });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'humidité:', error);
            await interaction.reply('Impossible de récupérer l\'humidité pour cette ville.');
        }
    },
};
