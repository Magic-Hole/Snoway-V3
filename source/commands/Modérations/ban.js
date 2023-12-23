const Discord = require('discord.js');
const Snoway = require('../../structures/client');

module.exports = {
    name: "ban",
    description: "Permet de bannir l'utilisateur mentionné",
    usages: {
        "ban <@user/ID> [raison]": "Permet de bannir un utilisateur du serveur, une raison peut être précisé"
    },
    /**
     * 
     * @param {Snoway} client 
     * @param {Discord.Message} message 
     * @param {string[]} args
     * @returns 
     */
    run: async (client, message, args) => {


        let user = message.mentions.users.first();
        let memberId = args[0];

        if (!user && memberId) {
            try {
                user = await client.users.fetch(memberId);
            } catch (error) {
                console.error(error);
            }
        }

        if (!user) {
            return message.channel.send(`> \`❌\` Erreur : Usage: \`ban @user @reason\``);
        }

        let reason = args.slice(1).join(' ') || `${await client.lang(`ban.aucuneraison`)}`;
        if ((await client.db.get(`owner`)).includes(user.id) || client.config.buyers.includes(user.id)) {
            return message.channel.send(`Je ne peux pas bannir cette personne...`);
        }

        let sanction = {
            type: "ban",
            id: Math.floor(Math.random() * 9999),
            user: user.id,
            reason: reason,
            date: new Date(),
            mod: message.author.id
        };

        let bannedUser;
        bannedUser = await client.users.fetch(user);

        message.guild.members.ban(user, { reason: reason }).then(async () => {
            message.channel.send(`**${bannedUser.username}** a été **ban**`);

            await client.db.push(`sanctions_${message.guild.id}`, sanction);
        });
    }
}