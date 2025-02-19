const discord = require("discord.js");
const db = require("../../database/models/music");

module.exports = async (client, interaction, args) => {
  const webhookClientLogs = new discord.WebhookClient({
    id: client.weblogs.weblog.id,
    token: client.weblogs.weblog.token,
  });

  let channel = interaction.member.voice
    ? interaction.member.voice.channel
    : null;
  if (!channel)
    return client.errNormal(
      { text: `The channel does not exist!`, type: "editreply" },
      interaction
    );

  client.radioStart(channel);

  db.findOne({ Guild: interaction.guild.id }, async (err, data) => {
    if (data) {
      data.Channel = channel.id;
      data.save();
    } else {
      new db({
        Guild: interaction.guild.id,
        Channel: channel.id,
      }).save();
    }
  });

  client.embed(
    {
      title: `📻・Started radio`,
      desc: `Radio has started successfully \nTo make the bot leave do: \`rleave\``,
      fields: [
        {
          name: "👤┆Started By",
          value: `${interaction.user} (${interaction.user.tag})`,
          inline: true,
        },
        {
          name: "📺┆Channel",
          value: `${channel} (${channel.name})`,
          inline: true,
        },
        {
          name: "🎶┆Radio Station",
          value: `[Radio 538](https://www.538.nl/)`,
          inline: true,
        },
      ],
      type: "editreply",
    },
    interaction
  );

  let embed = new discord.EmbedBuilder()
    .setTitle(`📻・Started radio`)
    .setDescription(`_______________ \n\nRadio has started successfully`)
    .addFields(
      {
        name: "👤┆Started By",
        value: `${interaction.user} (${interaction.user.tag})`,
        inline: true,
      },
      {
        name: "📺┆Channel",
        value: `${channel} (${channel.name})`,
        inline: true,
      },
      {
        name: "⚙️┆Guild",
        value: `${interaction.guild.name} (${interaction.guild.id})`,
        inline: true,
      }
    )
    .setColor("#5865F2")
    .setTimestamp();
  webhookClientLogs.send({
    username: "Bot Logs",
    embeds: [embed],
  });
};
