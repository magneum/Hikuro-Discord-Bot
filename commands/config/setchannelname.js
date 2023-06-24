const discord = require("discord.js");

const db = require("../../database/models/stats");

module.exports = async (client, interaction, args) => {
  const perms = await client.checkUserPerms(
    {
      flags: [discord.PermissionsBitField.Flags.ManageChannels],
      perms: [discord.PermissionsBitField.Flags.ManageChannels],
    },
    interaction
  );

  if (perms == false) return;

  const name = interaction.options.getString("name");

  if (name.toUpperCase() == "HELP") {
    return client.embed(
      {
        title: `ℹ️・Channel name options`,
        desc: `These are the channel name options: \n
            \`{emoji}\` - Channel emoji
            \`{name}\` - Channel name`,
        type: "editreply",
      },
      interaction
    );
  }

  db.findOne({ Guild: interaction.guild.id }, async (err, data) => {
    if (data) {
      data.ChannelTemplate = name;
      data.save();
    } else {
      new db({
        Guild: interaction.guild.id,
        ChannelTemplate: name,
      }).save();
    }

    client.succNormal(
      {
        text: `The channel name has been set successfully`,
        fields: [
          {
            name: `💬┆Name`,
            value: `${name}`,
            inline: true,
          },
        ],
        type: "editreply",
      },
      interaction
    );
  });
};
