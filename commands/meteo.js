const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('meteo')
        .setDescription('Obtenez la météo actuelle d\'une ville')
        .addStringOption(option =>
            option.setName('ville')
                .setDescription('La ville pour laquelle vous voulez la météo')
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

            const temp = response.data.current.temp_c;
            const description = response.data.current.condition.text;
            const humidity = response.data.current.humidity;
            const windSpeed = response.data.current.wind_kph;

            const embed = new EmbedBuilder()
                .setColor('#E5E510')
                .setTitle(`Météo à **${city}**`)
                .setDescription(`Voici les conditions actuelles de **${city}** :`)
                .addFields(
                    { name: 'Température', value: `${temp}°C`, inline: true },
                    { name: 'Condition', value: description, inline: true },
                    { name: 'Humidité', value: `${humidity}%`, inline: true },
                    { name: 'Vitesse du vent', value: `${windSpeed} km/h`, inline: true },
                )
                .setTimestamp()
                .setFooter({ text: 'BY TIFIOUSE', iconURL: 'https://cdn.discordapp.com/avatars/1266873308268331200/e47ac9ea924d042ce1f84dd91e7c327f.png?size=128' });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Erreur lors de la récupération des données météo:', error);
            await interaction.reply('Impossible de récupérer la météo pour cette ville.');
        }
    },
};
