import { REST, Routes } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

const commands = [
  {
    name: 'create',
    description: 'Generates short url',
    options: [
      {
        name: 'url',
        description: 'The URL to shorten',
        type: 3, // STRING type
        required: true,
      },
    ],
  },
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

try {
  console.log('Started refreshing application (/) commands.');

  await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID), { body: commands });

  console.log('Successfully reloaded application (/) commands.');
} catch (error) {
  console.error(error);
}