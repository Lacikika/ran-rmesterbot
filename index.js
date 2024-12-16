require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { incrementUserActivity } = require('./database.js');
const { log } = require('console');
const { Client, GatewayIntentBits, Collection } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
    partials: ['USER', 'GUILD_MEMBER', 'CHANNEL'],
});



// becous im shitty
function loging(kind, message, username,) {
    const timestamp = new Date().toISOString();

    if (kind === 'W') {
        console.warn(`[ ${timestamp} ][ WARNING ] ${username} | ${message}`);

    } else if (kind === 'E') {
        console.error(`[ ${timestamp} ][ ERROR ] ${username} | ${message}`);

    } else if (kind === 'I') {
        console.log(`[ ${timestamp} ][ INFO ] ${username} | ${message}`);
    }    
    else    {
        console.log(`[ ${timestamp} ][ ${kind} ] ${username} | ${message}`);
    }
} 

loging('W', 'test1', 'test2');


client.commands = new Collection();
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    if (command.data && command.data.name) {
        client.commands.set(command.data.name, command);
    } else {
        console.warn(`Command in ${file} is missing a valid data object with a name.`);
    }
}


const logFilePath = path.join(__dirname, 'interactionLogs.txt');
function logMessage(message) {
    const timestamp = new Date().toISOString();
    fs.appendFileSync(logFilePath, `[${timestamp}] ${message}\n`, 'utf8');
}
/*
let i = 1;
while (i <= 100) {
  console.log(`${i}%`);
  i++;
  setTimeout(() => {}, 1000); // wait 100ms before next iteration
}

*/

client.on('interactionCreate', async (interaction) => {
    try {
        // Handle Slash Commands
        if (interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (command) {
                await command.execute(interaction);
                loging('I', `Executed command: ${interaction.commandName} by ${interaction.user.tag}`, interaction.user.tag);
            } else {
                loging('W', `Command not found: ${interaction.commandName}`, interaction.user.tag);
            }
        }
        
        
        
        
        // Handle Button Interactions
        else if (interaction.isButton()) {
            const command = client.commands.get(interaction.message.interaction?.commandName || ''); // Optional chaining to support custom buttons
            if (command && command.handleButton) {
                await command.handleButton(interaction);
                loging('I', `Button interaction handled for command: ${interaction.message.interaction?.commandName || ''} by ${interaction.user.tag}`, interaction.user.tag);
            } else {
                loging('W', `Button interaction handler not found.`, interaction.user.tag);
            }
        }
        
        // Handle Select Menu Interactions
        else if (interaction.isSelectMenu()) {
            const command = client.commands.get(interaction.message.interaction?.commandName || '');
            if (command && command.handleSelectMenu) {
                await command.handleSelectMenu(interaction);
                loging('I', `Select menu interaction handled for command: ${interaction.message.interaction?.commandName || ''} by ${interaction.user.tag}`, interaction.user.tag);
            } else {
                loging('W', `Select menu handler not found.`, interaction.user.tag);
            }
        }
        
        // Handle Modal Submissions
        else if (interaction.isModalSubmit()) {
            const command = client.commands.get(interaction.customId);
            if (command && command.handleModal) {
                await command.handleModal(interaction);
                loging('I', `Modal submit interaction handled for custom ID: ${interaction.customId} by ${interaction.user.tag}`, interaction.user.tag);
            } else {
                loging('I', `Modal handler not found for ID: ${interaction.customId}`, interaction.user.tag);
            }
        }
        
        // Other types of interactions can be handled here if needed
        else {
            loging('W', `Unhandled interaction type: ${interaction.type}`, interaction.user.tag);
        }
    } catch (error) {
        loging('E', `Error handling interaction: ${error}`, interaction.user.tag);
        if (interaction.isRepliable()) {
            await interaction.reply({ content: 'There was an error processing this interaction!', ephemeral: true });
        }
    }
});


client.on('messageCreate', (message) => {
    // Ignore messages from bots
    if (message.author.bot) return;

    incrementUserActivity(message.author.id, message.content, message.author.username);
});


// Event listener for role changes
client.on('guildMemberUpdate', async (oldMember, newMember) => {
    const oldRolesCache = oldMember.roles.cache;
    const newRolesCache = newMember.roles.cache;

    const rolesAdded = newRolesCache.filter(role => !oldRolesCache.has(role.id));
    const rolesRemoved = oldRolesCache.filter(role => !newRolesCache.has(role.id));

    const user = newMember.user;
    let notificationMessage = '';

    if (rolesAdded.size > 0) {
        const addedRolesNames = rolesAdded.map(role => role.name).join(', ');
        notificationMessage += `🔹 Uj rangok hozzáadva: ${addedRolesNames}\n`;
        loging('I', `New roles added: ${addedRolesNames}`, user.tag);
    }
    if (rolesRemoved.size > 0) {
        const removedRolesNames = rolesRemoved.map(role => role.name).join(', ');
        notificationMessage += `🔻 Rang levéve: ${removedRolesNames}\n`;
        loging('I', `Roles removed: ${removedRolesNames}`, user.tag);
    }

    if (notificationMessage) {
        try {
            await user.send(`Szia  @${user.tag},\n${notificationMessage}`);
        } catch (error) {
            loging('E', `Failed to send message to ${user.tag}: ${error}`, user.tag);
        }
    }
});

client.once('ready', () => {


    // Lehetséges állapotok listája
    const activities = [
        { name: '/help | Segítség a parancsokhoz', type: 'LISTENING' },
        { name: 'a szervereket!', type: 'WATCHING' },
        { name: 'üzeneteket!', type: 'LISTENING' },
        { name: 'Fejlesztés alatt 🤖', type: 'PLAYING' },
    ];

    let currentIndex = 0;

    // Presence frissítése időzítővel
    setInterval(() => {
        const activity = activities[currentIndex]; // Válassza ki az aktuális állapotot
        client.user.setPresence({
            activities: [{ name: activity.name, type: activity.type }],
            status: 'online', // Állapot: online, idle, dnd (Ne zavarj)
        });
        loging('I', `Presence updated: ${activity.name}`, client.user.tag);
        currentIndex = (currentIndex + 1) % activities.length; // Váltson a következő állapotra
    }, 60000); // Frissítés 15 másodpercenként
});


// Log loaded commands
console.log(`Loaded ${client.commands.size} commands:`);
client.commands.forEach((command) => console.log(`- ${command.data.name}`));

// Log in to Discord with your bot token
client.login(process.env.BOT_TOKEN) // Make sure to use the environment variable for security
    .then(() => console.log("✅ elindultam te paraszt"))
    .catch(err => console.error("❌ Failed to log in:", err));
