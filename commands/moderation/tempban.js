const discord = require("discord.js");

const TempSchema = require("../../database/models/tempban");

module.exports = async (client, interaction, args) => {
  const perms = await client.checkPerms(
    {
      flags: [discord.PermissionsBitField.Flags.BanMembers],
      perms: [discord.PermissionsBitField.Flags.BanMembers],
    },
    interaction
  );

  if (perms == false) return;

  const member = await interaction.guild.members.fetch(
    interaction.options.getUser("user").id
  );
  const reason = interaction.options.getString("reason") || "Not given";

  if (
    member.permissions.has(discord.PermissionsBitField.Flags.BanMembers) ||
    member.permissions.has(discord.PermissionsBitField.Flags.BanMembers)
  )
    return client.errNormal(
      {
        error: "You can't ban a moderator",
        type: "editreply",
      },
      interaction
    );

  client
    .embed(
      {
        title: `🔨・Ban`,
        desc: `You've been banned in **${interaction.guild.name}**`,
        fields: [
          {
            name: "👤┆Banned by",
            value: interaction.user.tag,
            inline: true,
          },
          {
            name: "💬┆Reason",
            value: reason,
            inline: true,
          },
        ],
      },
      member
    )
    .then(async function () {
      member.ban({ reason: reason });
      client.succNormal(
        {
          text: "The specified user has been successfully banned and successfully received a notification!",
          fields: [
            {
              name: "👤┆Banned user",
              value: member.user.tag,
              inline: true,
            },
            {
              name: "💬┆Reason",
              value: reason,
              inline: true,
            },
          ],
          type: "editreply",
        },
        interaction
      );

      const expires = new Date();
      expires.setMinutes(
        expires.getMinutes() + parseInt(interaction.options.getNumber("time"))
      );

      await new TempSchema({
        guildId: interaction.guild.id,
        userId: member.id,
        expires,
      }).save();
    })
    .catch(async function () {
      member.ban({ reason: reason });
      client.succNormal(
        {
          text: "The given user has been successfully banned, but has not received a notification!",
          type: "editreply",
        },
        interaction
      );

      const expires = new Date();
      expires.setMinutes(
        expires.getMinutes() + parseInt(interaction.options.getNumber("time"))
      );

      await new TempSchema({
        guildId: interaction.guild.id,
        userId: member.id,
        expires,
      }).save();
    });
};
