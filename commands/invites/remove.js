const discord = require("discord.js");

const db = require("../../database/models/invites");

module.exports = async (client, interaction, args) => {
  let user = interaction.options.getUser("user");
  let amount = interaction.options.getNumber("amount");

  const perms = await client.checkUserPerms(
    {
      flags: [discord.PermissionsBitField.Flags.ManageMessages],
      perms: [discord.PermissionsBitField.Flags.ManageMessages],
    },
    interaction
  );

  if (perms == false) return;

  const data = await db.findOne({
    Guild: interaction.guild.id,
    User: user.id,
  });
  if (data) {
    data.Invites -= amount;
    data.Total -= amount;
    data.save();
  } else {
    return client.errNormal(
      {
        error: `No invite data found for ${user}`,
        type: "editreply",
      },
      interaction
    );
  }

  client.succNormal(
    {
      text: `Removed **${amount}** invites from ${user}`,
      fields: [
        {
          name: "📨┆Total invites",
          value: `${data.Invites}`,
          inline: true,
        },
      ],
      type: "editreply",
    },
    interaction
  );
};
