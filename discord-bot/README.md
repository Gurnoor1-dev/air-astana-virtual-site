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
