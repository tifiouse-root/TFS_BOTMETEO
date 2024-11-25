const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const config = require('./config.json');  // CHARGEMENT DU FICHIER CONFIG.JSON
const fs = require('fs');
const path = require('path');

// CRÉER UNE INSTANCE DU CLIENT DISCORD
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// RÉCUPÉRER LE TOKEN DU BOT ET LA CLÉ WEATHER API DU FICHIER CONFIG.JSON
const { token, weatherAPIKey, ClientIDPourSlashCommandes } = config;  // DÉSTRUCTURER POUR OBTENIR LA CLÉ API AUSSI

// TABLEAU POUR STOCKER LES COMMANDES
const commands = [];

// LIRE TOUTES LES COMMANDES DANS LE DOSSIER "commands"
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}

// ENREGISTRER LES COMMANDES DANS DISCORD
const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.clear();
        const start = Date.now(); require('axios').get('https://api.weatherapi.com/').then(() => console.log(`Temps de réponse: \x1b[33m${Date.now() - start}\x1b[0m ms`)).catch(console.error);
        console.log('\x1b[33m%s\x1b[0m', `
            ███╗   ███╗███████╗████████╗███████╗ ██████╗ 
            ████╗ ████║██╔════╝╚══██╔══╝██╔════╝██╔═══██╗
            ██╔████╔██║█████╗     ██║   █████╗  ██║   ██║
            ██║╚██╔╝██║██╔══╝     ██║   ██╔══╝  ██║   ██║
            ██║ ╚═╝ ██║███████╗   ██║   ███████╗╚██████╔╝
            ╚═╝     ╚═╝╚══════╝   ╚═╝   ╚══════╝ ╚═════╝ 
                        [BY TIFIOUSE 1.0.0]
            `);
            
        console.log('Chargement en cours ...');
        console.log("En attente de l'api de weatherapi.com ...")
        await rest.put(Routes.applicationCommands(ClientIDPourSlashCommandes), {
            body: commands,
        });
        console.log('Chargement des commandes avec succès !');
    } catch (error) {
        console.error('ERREUR LORS DE L\'ENREGISTREMENT DES COMMANDES:', error);
    }
})();

// QUAND LE BOT EST PRÊT
client.once('ready', () => {
    console.log('           \x1b[33m Bot en ligne ! \x1b[0m');
});

// GÉRER LES INTERACTIONS (COMMANDES SLASH)
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;
    const commandFile = require(`./commands/${commandName}.js`);
    
    // PASSER LA CLÉ API À LA COMMANDE LORSQU'ELLE EST EXÉCUTÉE
    try {
        await commandFile.execute(interaction, weatherAPIKey);  // PASSER LA weatherAPIKey ICI
    } catch (error) {
        console.error(error);
        await interaction.reply('UNE ERREUR EST SURVENU LORS DE L\'EXÉCUTION DE LA COMMANDE.');
    }
});

// CONNEXION DU BOT AVEC LE TOKEN
client.login(token);

