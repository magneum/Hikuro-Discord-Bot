const discord = require("discord.js");

const db = require("../../database/models/reactionRoles");

module.exports = async (client, interaction, args) => {
  const category = interaction.options.getString("category");
  const role = interaction.options.getRole("role");
  const emoji = interaction.options.getString("emoji");

  const parsedEmoji = discord.parseEmoji(emoji);
  if (!parsedEmoji)
    return client.errNormal(
      {
        error: `Emoji not found in this server!`,
        type: "editreply",
      },
      interaction
    );

  db.findOne(
    { Guild: interaction.guild.id, Category: category },
    async (err, data) => {
      if (data) {
        data.Roles[emoji] = [
          role.id,
          {
            id: parsedEmoji.id,
            raw: emoji,
          },
        ];

        await db.findOneAndUpdate(
          { Guild: interaction.guild.id, Category: category },
          data
        );
      } else {
        new db({
          Guild: interaction.guild.id,
          Message: 0,
          Category: category,
          Roles: {
            [emoji]: [
              role.id,
              {
                id: parsedEmoji.id,
                raw: emoji,
              },
            ],
          },
        }).save();
      }

      client.succNormal(
        {
          text: "Reaction role successfully created! Create a panel in the following way",
          fields: [
            {
              name: `📘┆Menu panel`,
              value: `\`/reactionroles menu [category name]\``,
              inline: true,
            },
            {
              name: `📘┆Button panel`,
              value: `\`/reactionroles button [category name]\``,
              inline: true,
            },
          ],
          type: "editreply",
        },
        interaction
      );
    }
  );
};
