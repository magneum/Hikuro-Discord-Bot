const slotItems = ["🍇", "🍉", "🍊", "🍎", "🍓", "🍒"];
const discord = require("discord.js");
const db = require("../../database/models/economy");

module.exports = async (client, interaction, args) => {
  let user = interaction.user;

  db.findOne(
    { Guild: interaction.guild.id, User: user.id },
    async (err, data) => {
      if (data) {
        let money = parseInt(interaction.options.getNumber("amount"));
        let win = false;

        if (!money)
          return client.errUsage(
            { usage: "slots [amount]", type: "editreply" },
            interaction
          );
        if (money > data.Money)
          return client.errNormal(
            { error: `You are betting more than you have!`, type: "editreply" },
            interaction
          );

        let number = [];
        for (i = 0; i < 3; i++) {
          number[i] = Math.floor(Math.random() * slotItems.length);
        }

        if (number[0] == number[1] && number[1] == number[2]) {
          money *= 9;
          win = true;
        } else if (
          number[0] == number[1] ||
          number[0] == number[2] ||
          number[1] == number[2]
        ) {
          money *= 2;
          win = true;
        }

        const row = new discord.ActionRowBuilder().addComponents(
          new discord.ButtonBuilder()
            .setCustomId("slots_1")
            .setLabel(`${slotItems[number[0]]}`)
            .setStyle(discord.ButtonStyle.Primary),

          new discord.ButtonBuilder()
            .setCustomId("slots_2")
            .setLabel(`${slotItems[number[1]]}`)
            .setStyle(discord.ButtonStyle.Primary),

          new discord.ButtonBuilder()
            .setCustomId("slots_3")
            .setLabel(`${slotItems[number[2]]}`)
            .setStyle(discord.ButtonStyle.Primary)
        );
        if (win) {
          client.embed(
            {
              title: `🎰・Slots`,
              desc: `You won **${client.emotes.economy.coins} $${money}**`,
              color: "#57F287",
              components: [row],
              type: "editreply",
            },
            interaction
          );

          data.Money += money;
          data.save();
        } else {
          client.embed(
            {
              title: `🎰・Slots`,
              desc: `You lost **${client.emotes.economy.coins} $${money}**`,
              components: [row],
              color: "#ED4245",
              type: "editreply",
            },
            interaction
          );

          data.Money -= money;
          data.save();
        }
      } else {
        client.errNormal(
          {
            error: `You has no ${client.emotes.economy.coins}!`,
            type: "editreply",
          },
          interaction
        );
      }
    }
  );
};
