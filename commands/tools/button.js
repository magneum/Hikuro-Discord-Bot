const discord = require("discord.js");

module.exports = async (client, interaction, args) => {
  const url = interaction.options.getString("url");
  const text = interaction.options.getString("text");

  if (text.length > 50)
    return client.errNormal(
      {
        error: "Your button text cannot be longer than 50 characters",
        type: "editreply",
      },
      interaction
    );

  let button = new discord.ButtonBuilder()
    .setLabel(`${text}`)
    .setURL(`${url}`)
    .setStyle(discord.ButtonStyle.Link);

  let row = new discord.ActionRowBuilder().addComponents(button);

  client.embed(
    {
      title: `🔗・${text}`,
      desc: `Click the button to open the link!`,
      components: [row],
      type: "editreply",
    },
    interaction
  );
};
