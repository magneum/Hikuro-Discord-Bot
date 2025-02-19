const discord = require("discord.js");

const db = require("../../database/models/suggestionChannels");

module.exports = async (client, interaction, args) => {
  const perms = await client.checkUserPerms(
    {
      flags: [discord.PermissionsBitField.Flags.ManageMessages],
      perms: [discord.PermissionsBitField.Flags.ManageMessages],
    },
    interaction
  );

  if (perms == false) return;

  const messageID = interaction.options.getString("id");

  const data = await db.findOne({ Guild: interaction.guild.id });
  if (data) {
    const suggestionchannel = interaction.guild.channels.cache.get(
      data.Channel
    );
    const suggestEmbed = await suggestionchannel.messages.fetch(messageID);
    const embedData = suggestEmbed.embeds[0];

    client.embed(
      {
        title: `${client.emotes.normal.check}・Suggestion accepted`,
        desc: `\`\`\`${embedData.description}\`\`\``,
        color: "#57F287",
        author: {
          name: embedData.author.name,
          iconURL: embedData.author.iconURL,
        },
        type: "edit",
      },
      suggestEmbed
    );

    try {
      const user = await client.users.cache.find(
        (u) => u.tag === embedData.author.name
      );

      if (user) {
        client
          .embed(
            {
              title: `${client.emotes.normal.check}・Suggestion accepted`,
              desc: `Your suggestion in ${interaction.guild.name} has been accepted by a moderator!`,
              fields: [
                {
                  name: `💬┆Suggestion`,
                  value: `${embedData.description}`,
                },
              ],
            },
            user
          )
          .catch({});
      }
    } catch {}

    client.succNormal(
      {
        text: "Suggestion successfully accepted",
        fields: [
          {
            name: `💬┆Suggestion`,
            value: `${embedData.description}`,
          },
        ],
        type: "editreply",
      },
      interaction
    );
  } else {
    client.errNormal(
      {
        error: `No suggestion channel set! Please do the setup`,
        type: "editreply",
      },
      interaction
    );
  }
};
