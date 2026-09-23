# Air Astana Virtual Discord Bot

Dedicated Node.js Discord bot/API for Crew Center. Discord message creation, PIREP reactions, and pending threads are owned by this service instead of the Supabase Edge Function.

## Discord permissions
View Channel, Send Messages, Embed Links, Read Message History, Add Reactions, Create Public Threads, Send Messages in Threads, and preferably Manage Messages.

## Environment
DISCORD_BOT_TOKEN
DISCORD_PIREP_CHANNEL_ID
DISCORD_EVENT_CHANNEL_ID
BOT_API_SECRET
PORT

Never commit the real token or secret.

## Hosting
Node.js 20+. Start command: npm start
Health check: GET /health

## Crew Center connection
Set Supabase Edge Function secrets:
DISCORD_BOT_API_URL=https://YOUR-BOT-HOST
DISCORD_BOT_API_SECRET=the-same-value-as-BOT_API_SECRET

The website will send Discord operations to this bot over HTTPS. The old Discord webhook URLs are not required for the new path.

## Security
Only requests carrying x-bot-secret are accepted. Use a long random secret and HTTPS.

## Pella deployment
1. Create a Discord Bot application in the Discord Developer Portal and copy the bot token.
2. Invite the bot to your VA server and give it the channel permissions listed above.
3. Push/import this repository (or the discord-bot folder) into Pella as a Discord Bot / Node.js project.
4. Set the start command to npm start.
5. Add the five environment variables from .env.example.
6. Start the bot and confirm GET /health reports ready=true if Pella exposes an HTTP URL. The Crew Center integration only needs the bot API URL to be reachable over HTTPS.
7. In Supabase, add DISCORD_BOT_API_URL and DISCORD_BOT_API_SECRET as Edge Function secrets, using the same BOT_API_SECRET as the Pella project.
8. In Crew Center Admin > Discord Bot, enter the PIREP and Events channel IDs and save.
9. Use Send test PIREP. It should create the test message and 🔴 reaction. If it does not, check the Pella bot logs first.
