const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('previsions')
        .setDescription('Obtenez les prévisions météorologiques pour les 3 prochains jours')
        .addStringOption(option =>
            option.setName('ville')
                .setDescription('La ville pour laquelle vous voulez connaître les prévisions')
                .setRequired(true)),
    async execute(interaction, weatherAPIKey) {
        const city = interaction.options.getString('ville');
        try {
            const response = await axios.get('https://api.weatherapi.com/v1/forecast.json', {
                params: {
                    key: weatherAPIKey,
                    q: city,
                    days: 3,
                    lang: 'fr',
                }
            });

            const forecast = response.data.forecast.forecastday;

            const embed = new EmbedBuilder()
                .setColor('#E5E510')
                .setTitle(`Prévisions à **${city}** pour les 3 prochains jours`)
                .setDescription(`Voici les prévisions pour **${city}**:`)
                .addFields(
                    forecast.map(day => ({
                        name: `Jour: ${day.date}`,
                        value: `Température: ${day.day.avgtemp_c}°C\nCondition: ${day.day.condition.text}\nVent: ${day.day.maxwind_kph} km/h`,
                        inline: true,
                    }))
                )
                .setTimestamp()
                .setFooter({ text: 'BY TIFIOUSE', iconURL: 'https://cdn.discordapp.com/avatars/1266873308268331200/e47ac9ea924d042ce1f84dd91e7c327f.png?size=128' });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Erreur lors de la récupération des prévisions:', error);
            await interaction.reply('Impossible de récupérer les prévisions pour cette ville.');
        }
    },
};
