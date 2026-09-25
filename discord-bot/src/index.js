import express from "express";
import { Client, GatewayIntentBits, Partials, ChannelType } from "discord.js";

for (const key of ["DISCORD_BOT_TOKEN", "BOT_API_SECRET"]) {
  if (!process.env[key]) throw new Error("Missing " + key);
}

const app = express();
app.use(express.json({ limit: "1mb" }));
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages], partials: [Partials.Channel, Partials.Message] });

const auth = (req, res, next) => {
  if (req.header("x-bot-secret") !== process.env.BOT_API_SECRET) return res.status(401).json({ ok: false, error: "Unauthorized" });
  next();
};
const channelIdFor = (kind, supplied) => supplied || (kind === "event" ? process.env.DISCORD_EVENT_CHANNEL_ID : process.env.DISCORD_PIREP_CHANNEL_ID);

async function getTextChannel(id) {
  if (!id) throw new Error("Discord channel ID is not configured.");
  const channel = await client.channels.fetch(id);
  if (!channel || ![ChannelType.GuildText, ChannelType.GuildAnnouncement].includes(channel.type)) throw new Error("Configured Discord channel is not a text/announcement channel.");
  return channel;
}
async function clearStatusReactions(message) {
  for (const emoji of ["🔴", "🟡", "🟢"]) {
    try {
      const reaction = message.reactions.cache.find(r => r.emoji.name === emoji);
      if (reaction) await reaction.users.remove(client.user.id);
    } catch {}
  }
}
const statusEmoji = status => status === "approved" ? "🟢" : status === "pending" ? "🟡" : "🔴";
const pirepEmbedImage = { url: "https://i.postimg.cc/44pSxbNY/PIREP-Submitted.jpg" };

async function crewDispatchAction(payload) {
  const base = String(process.env.CREW_CENTER_API_URL || "https://huqvffdiwqilbpxepfpo.supabase.co/functions/v1/crew-center").replace(/\/$/, "");
  const response = await fetch(base + "?action=bot-dispatch", {
    method: "POST",
    headers: { "content-type": "application/json", "x-bot-secret": process.env.BOT_API_SECRET },
    body: JSON.stringify(payload)
  });
  const raw = await response.text();
  let data = null;
  try { data = raw ? JSON.parse(raw) : null; } catch {}
  if (!response.ok || data?.ok === false) throw new Error(data?.error || "Crew Center dispatch request failed.");
  return data || {};
}


async function sendEmbed(kind, body) {
  const channel = await getTextChannel(channelIdFor(kind, body.channelId));
  const embed = kind === "pirep" ? { ...body.embed, image: body.embed?.image || pirepEmbedImage } : body.embed;
  const message = await channel.send({ content: body.content || undefined, embeds: [embed] });
  return { channelId: channel.id, messageId: message.id };
}

app.post("/internal/dispatch", auth, async (req, res) => {
  try {
    const channel = await getTextChannel(req.body.channelId);
    const message = await channel.send(req.body.payload || {});
    let threadId = null;
    if (message?.id) {
      try {
        const thread = await message.startThread({
          name: req.body.threadName || "Flight Dispatch 🛫",
          autoArchiveDuration: 1440
        });
        threadId = thread.id;
      } catch (error) {
        console.error("dispatch thread creation failed", error);
      }
    }
    res.json({ ok: true, channelId: channel.id, messageId: message.id, threadId });
  } catch (error) {
    res.status(502).json({ ok: false, error: error instanceof Error ? error.message : "Discord dispatch failed" });
  }
});

app.get("/health", (_req, res) => res.json({ ok: true, ready: client.isReady(), bot: client.user?.tag || null }));

app.post("/internal/test", auth, async (req, res) => {
  try {
    const kind = req.body.kind === "event" ? "event" : "pirep";
    const result = await sendEmbed(kind, {
      content: kind === "pirep" ? "Air Astana Virtual webhook test ✅" : "Air Astana Virtual event webhook test ✈️",
      embed: {
        title: kind === "pirep" ? "PIREP Bot Test" : "Event Bot Test",
        description: "The dedicated Air Astana Virtual Discord bot is connected to Crew Center.",
        color: Number(req.body.color || 0xd9bd7b),
        footer: { text: req.body.footer || "Managed by Gurnoor | CEO" },
        timestamp: new Date().toISOString()
      }
    });
    if (kind === "pirep") {
      const channel = await getTextChannel(result.channelId);
      const message = await channel.messages.fetch(result.messageId);
      await clearStatusReactions(message);
      await message.react("🔴");
    }
    res.json({ ok: true, ...result });
  } catch (error) {
    res.status(502).json({ ok: false, error: error instanceof Error ? error.message : "Discord request failed" });
  }
});

app.post("/internal/pirep", auth, async (req, res) => {
  try {
    const p = req.body;
    const result = await sendEmbed("pirep", {
      channelId: p.channelId,
      content: "New PIREP Submitted! ✅",
      embed: {
        title: "New PIREP Submitted! ✅",
        color: Number(p.color || 0xd9bd7b),
        fields: [
          { name: "Pilot", value: (p.ifcUsername || "Unknown") + " (" + (p.callsign || "No callsign") + ")", inline: false },
          { name: "Flight No", value: p.flightNumber || "NA", inline: true },
          { name: "Departure", value: p.departure || "NA", inline: true },
          { name: "Arrival", value: p.arrival || "NA", inline: true },
          { name: "Aircraft", value: p.aircraft || "NA", inline: true },
          { name: "Flight Time", value: p.flightTime || "0h 0m", inline: true },
          { name: "Submitted at", value: "<t:" + Math.floor(new Date(p.submittedAt || Date.now()).getTime() / 1000) + ":F>", inline: false },
          { name: "Notes", value: p.notes || "NA", inline: false }
        ],
        footer: { text: p.footer || "Managed by Gurnoor | CEO" },
        timestamp: p.submittedAt || new Date().toISOString()
      }
    });
    const channel = await getTextChannel(result.channelId);
    const message = await channel.messages.fetch(result.messageId);
    await clearStatusReactions(message);
    await message.react(statusEmoji(p.status || "pending"));
    res.json({ ok: true, ...result });
  } catch (error) {
    res.status(502).json({ ok: false, error: error instanceof Error ? error.message : "Discord PIREP failed" });
  }
});

app.post("/internal/event", auth, async (req, res) => {
  try {
    const e = req.body;
    const result = await sendEmbed("event", {
      channelId: e.channelId,
      content: "New Air Astana Virtual Event ✈️",
      embed: {
        title: e.title || "VA Event",
        description: e.description || "Air Astana Virtual crew event.",
        color: Number(e.color || 0xd9bd7b),
        fields: [
          { name: "Starts", value: e.startsAt ? "<t:" + Math.floor(new Date(e.startsAt).getTime() / 1000) + ":F>" : "TBA", inline: true },
          { name: "Location", value: e.location || "Online", inline: true },
          { name: "Aircraft", value: e.aircraft || "—", inline: true },
          { name: "Route", value: e.route || "—", inline: true }
        ],
        image: e.imageUrl ? { url: e.imageUrl } : undefined,
        footer: { text: e.footer || "Managed by Gurnoor | CEO" },
        timestamp: e.submittedAt || new Date().toISOString()
      }
    });
    res.json({ ok: true, ...result });
  } catch (error) {
    res.status(502).json({ ok: false, error: error instanceof Error ? error.message : "Discord event failed" });
  }
});

app.post("/internal/pirep-status", auth, async (req, res) => {
  try {
    const { channelId, messageId, status, pendingThreadName } = req.body;
    const channel = await getTextChannel(channelId);
    const message = await channel.messages.fetch(messageId);
    await clearStatusReactions(message);
    await message.react(statusEmoji(status));
    let threadId = null;
    if (status === "pending" && !message.hasThread) {
      const thread = await message.startThread({ name: pendingThreadName || "PIREP Pending 🟡", autoArchiveDuration: 1440 });
      threadId = thread.id;
    }
    res.json({ ok: true, channelId, messageId, threadId });
  } catch (error) {
    res.status(502).json({ ok: false, error: error instanceof Error ? error.message : "Discord PIREP status failed" });
  }
});

client.on("interactionCreate", async interaction => {
  if (!interaction.isButton()) return;
  const [kind, action, dispatchId] = String(interaction.customId || "").split(":");
  if (kind !== "dispatch" || !action || !dispatchId) return;
  try {
    const result = await crewDispatchAction({
      action,
      id: dispatchId,
      discordUserId: interaction.user.id
    });
    if (action === "details") {
      await interaction.reply({ content: result.content || "Flight details unavailable.", ephemeral: true });
      return;
    }
    await interaction.deferUpdate();
    if (result.dispatch?.payload && interaction.message) {
      await interaction.message.edit(result.dispatch.payload);
    }
    const verb = action === "join" ? "joined" : "left";
    await interaction.followUp({
      content: "You " + verb + " " + (result.participantCount != null ? "the flight." : "the flight."),
      ephemeral: true
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Dispatch action failed.";
    if (interaction.deferred || interaction.replied) {
      await interaction.followUp({ content: "❌ " + message, ephemeral: true }).catch(() => {});
    } else {
      await interaction.reply({ content: "❌ " + message, ephemeral: true }).catch(() => {});
    }
  }
});

const port = Number(process.env.PORT || 3000);
app.listen(port, () => console.log("Bot API listening on :" + port));
client.once("ready", () => console.log("Discord bot ready as " + client.user.tag));
client.login(process.env.DISCORD_BOT_TOKEN).catch(error => { console.error("Discord login failed:", error); process.exit(1); });
