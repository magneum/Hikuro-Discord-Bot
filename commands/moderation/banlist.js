const discord = require("discord.js");

module.exports = async (client, interaction, args) => {
  const perms = await client.checkPerms(
    {
      flags: [discord.PermissionsBitField.Flags.BanMembers],
      perms: [discord.PermissionsBitField.Flags.BanMembers],
    },
    interaction
  );

  if (perms == false) return;

  interaction.guild.bans
    .fetch()
    .then(async (banned) => {
      let list = banned.map(
        (banUser) =>
          `${banUser.user.tag}・**Reason:** ${banUser.reason || "No reason"}`
      );

      if (list.length == 0)
        return client.errNormal(
          {
            error: `This server has no bans`,
            type: "editreply",
          },
          interaction
        );

      await client.createLeaderboard(
        `🔧・Banlist - ${interaction.guild.name}`,
        list,
        interaction
      );
    })
    .catch((error) => {
      console.log(error);
    });
};
