import { Client, Events, GatewayIntentBits } from 'discord.js';
import express from 'express';
import dotenv from 'dotenv';
import { handleGenerateShortURL } from './controller/url.js';
import { connectMongoDB } from './connection.js';
import URL from './model/url.js';

dotenv.config();



const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const app = express();
const PORT = 3000;

app.get('/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    
    try {
        const entry = await URL.findOneAndUpdate(
            { shortId },
            {
                $push: {
                    visitHistory: { timestamp: Date.now() }
                }
            }
        );
        
        if (!entry) {
            return res.status(404).send('Short URL not found');
        }
        
        res.redirect(entry.redirectUrl);
    } catch (error) {
        res.status(500).send('Server error');
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

connectMongoDB(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(() => console.log("MOngoDB not connected"))

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    message.reply({
        content: "Hi from Bot"
    })
    if (message.content.startsWith("create")) {
        const url = message.content.split("create")[1].trim();
        
        try {
            const shortId = await handleGenerateShortURL(
                message.author.id,        // Discord user ID
                message.author.username,  // Discord username
                message.guildId,          // Server/Guild ID
                url                       // The URL to shorten
            );
            
            message.reply({
                content: `✅ Short URL created: http://localhost:3000/${shortId}`
            });
        } catch (error) {
            message.reply({
                content: `❌ Error: ${error.message}`
            });
        }
    }
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "create") {
        const url = interaction.options.getString("url");
        
        try {
            const shortId = await handleGenerateShortURL(
                interaction.user.id,
                interaction.user.username,
                interaction.guildId,
                url
            );
            
            await interaction.reply({
                content: `✅ Short URL created: http://localhost:3000/${shortId}`
            });
        } catch (error) {
            await interaction.reply({
                content: `❌ Error: ${error.message}`,
                ephemeral: true
            });
        }
    }
})

client.login(process.env.DISCORD_TOKEN)