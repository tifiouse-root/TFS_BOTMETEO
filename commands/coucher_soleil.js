const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('coucher_soleil')
        .setDescription('Obtenez l\'heure du coucher du soleil dans une ville')
        .addStringOption(option =>
            option.setName('ville')
                .setDescription('La ville pour laquelle vous voulez l\'heure du coucher du soleil')
                .setRequired(true)),
    async execute(interaction, weatherAPIKey) {
        const city = interaction.options.getString('ville');
        try {
            const response = await axios.get('https://api.weatherapi.com/v1/astronomy.json', {
                params: {
                    key: weatherAPIKey,
                    q: city,
                    lang: 'fr',
                }
            });

            const sunset = response.data.astronomy.astro.sunset;

            const embed = new EmbedBuilder()
                .setColor('#E5E510')
                .setTitle(`Heure du coucher du soleil à **${city}**`)
                .setDescription(`L'heure du coucher du soleil à **${city}** est à **${sunset}**.`)
                .setTimestamp()
                .setFooter({ text: 'BY TIFIOUSE', iconURL: 'https://cdn.discordapp.com/avatars/1266873308268331200/e47ac9ea924d042ce1f84dd91e7c327f.png?size=128' });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'heure du coucher du soleil:', error);
            await interaction.reply('Impossible de récupérer l\'heure du coucher du soleil pour cette ville.');
        }
    },
};
