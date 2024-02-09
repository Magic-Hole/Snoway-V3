const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'roleUpdate',
    run: async (client, oldRole, newRole) => {
        const color = await client.db.get(`color_${oldRole.guild.id}`) || client.config.color;
        const logs = await client.db.get(`logs_${oldRole.guild.id}`) || [];
        const salon = client.channels.cache.get(logs[0]?.roles);
        if (!salon) return;

        const embed = new EmbedBuilder()
            .setColor(color)
            .setFooter(client.footer)
            .setTitle('Modification de Rôle');

        if (oldRole.name !== newRole.name) {
            embed.addFields({name: "Nom", value: `*Avant :* \`\`\`js\n${oldRole.name}\`\`\`\n*Après :* \`\`\`js\n${newRole.name}\`\`\``, inline: true});
        }
        if (oldRole.color !== newRole.color) {
            embed.addFields({name:"Couleur", value:  `*Avant :* \`\`\`js\n${oldRole.color === 0 ? "Aucune" : oldRole.hexColor}\`\`\`\n*Après :* \`\`\`js\n${newRole.color === 0 ? "Aucune" : newRole.hexColor}\`\`\``, inline: true});;
        }
        if (oldRole.mentionable !== newRole.mentionable) {
            embed.addFields({name: "Mentionable", value: `*Avant :* \`\`\`js\n${oldRole.mentionable ? "Oui" : "Non"}\`\`\`\n*Après :* \`\`\`js\n${newRole.mentionable ? "Oui" : "Non"}\`\`\``, inline: true});
        }

            const fields = embed.data.fields || [];

            if (fields?.length > 0) {
                salon.send({ embeds: [embed] });
            }
        
    }
};
