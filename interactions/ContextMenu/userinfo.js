const { ContextMenuCommandBuilder } = require("discord.js");
const model = require("../../database/models/badge");

module.exports = {
  data: new ContextMenuCommandBuilder().setName("Userinfo").setType(2),
  run: async (client, interaction, args) => {
    await interaction.deferReply({ ephemeral: false });
    const member = await interaction.guild.members.fetch(
      interaction.options.getUser("user").id
    );
    if (!member)
      return client.errNormal(
        {
          error: "This user is not in this guild!",
          type: "editreply",
        },
        interaction
      );

    const badgeFlags = {
      DEVELOPER: client.emotes.badges.developer,
      BUGS: client.emotes.badges.bug,
      MANAGEMENT: client.emotes.badges.management,
      PREMIUM: client.emotes.badges.premium,
      SUPPORTER: client.emotes.badges.supporter,
      TEAM: client.emotes.badges.team,
      BOOSTER: client.emotes.badges.booster,
      PARTNER: client.emotes.badges.partner,
      VOTER: client.emotes.badges.voter,
      SUPPORT: client.emotes.badges.support,
      MODERATOR: client.emotes.badges.moderator,
      DESIGNER: client.emotes.badges.designer,
      MARKETING: client.emotes.badges.marketing,
    };

    const flags = {
      ActiveDeveloper: "👨‍💻・Active Developer",
      BugHunterLevel1: "🐛・discord Bug Hunter",
      BugHunterLevel2: "🐛・discord Bug Hunter",
      CertifiedModerator: "👮‍♂️・Certified Moderator",
      HypeSquadOnlineHouse1: "🏠・House Bravery Member",
      HypeSquadOnlineHouse2: "🏠・House Brilliance Member",
      HypeSquadOnlineHouse3: "🏠・House Balance Member",
      HypeSquadEvents: "🏠・HypeSquad Events",
      PremiumEarlySupporter: "👑・Early Supporter",
      Partner: "👑・Partner",
      Quarantined: "🔒・Quarantined", // Not sure if this is still a thing
      Spammer: "🔒・Spammer", // Not sure if this one works
      Staff: "👨‍💼・discord Staff",
      TeamPseudoUser: "👨‍💼・discord Team",
      VerifiedBot: "🤖・Verified Bot",
      VerifiedDeveloper: "👨‍💻・(early)Verified Bot Developer",
    };

    let Badges = await model.findOne({ User: member.user.id });
    if (!Badges) Badges = { User: member.user.id };
    const roles = member.roles.cache
      .sort((a, b) => b.position - a.position)
      .map((role) => role.toString())
      .slice(0, -1);
    const userFlags = member.user.flags ? member.user.flags.toArray() : [];

    return client.embed(
      {
        title: `👤・User information`,
        desc: `Information about ${member.user.username}`,
        thumbnail: member.user.displayAvatarURL({ dynamic: true, size: 1024 }),
        image: member.user.bannerURL({ dynamic: true, size: 1024 }),
        fields: [
          {
            name: "Username",
            value: `${member.user.username}`,
            inline: true,
          },
          {
            name: "Discriminator",
            value: `${member.user.discriminator}`,
            inline: true,
          },
          {
            name: "Nickname",
            value: `${member.nickname || "No nickname"}`,
            inline: true,
          },
          {
            name: "Id",
            value: `${member.user.id}`,
            inline: true,
          },
          {
            name: "Flags",
            value: `${
              userFlags.length
                ? userFlags.map((flag) => flags[flag]).join(", ")
                : "None"
            }`,
            inline: true,
          },
          {
            name: "Badges",
            value: `${
              Badges.FLAGS
                ? Badges.FLAGS.map((flag) => {
                    switch (flag) {
                      case "DEVELOPER":
                        return badgeFlags.DEVELOPER;
                      case "BUGS":
                        return badgeFlags.BUGS;
                      case "MANAGEMENT":
                        return badgeFlags.MANAGEMENT;
                      case "PREMIUM":
                        return badgeFlags.PREMIUM;
                      case "SUPPORTER":
                        return badgeFlags.SUPPORTER;
                      case "TEAM":
                        return badgeFlags.TEAM;
                      case "BOOSTER":
                        return badgeFlags.BOOSTER;
                      case "PARTNER":
                        return badgeFlags.PARTNER;
                      case "VOTER":
                        return badgeFlags.VOTER;
                      case "SUPPORT":
                        return badgeFlags.SUPPORT;
                      case "MODERATOR":
                        return badgeFlags.MODERATOR;
                      case "DESIGNER":
                        return badgeFlags.DESIGNER;
                      case "MARKETING":
                        return badgeFlags.MARKETING;
                      default:
                        return "";
                    }
                  }).join(" ")
                : "None"
            }`,
            inline: true,
          },
          {
            name: "discord joined at",
            value: `<t:${Math.round(member.user.createdTimestamp / 1000)}>`,
            inline: true,
          },
          {
            name: "Server joined at",
            value: `<t:${Math.round(member.joinedAt / 1000)}>`,
            inline: true,
          },
          {
            name: `Roles [${roles.length}]`,
            value: `${roles.length ? roles.join(", ") : "None"}`,
            inline: false,
          },
        ],
        type: "editreply",
      },
      interaction
    );
  },
};
