import prettyMs from "pretty-ms";
import fetch from "fetchio-js";

export default {
	name: "uptime",
	aliases: ["up"],
	description: "Get the bots uptime",
	execute: async (message, args, client, streamerName) => {
		const response = await fetch(`https://api.disstreamchat.com/stats/twitch/?name=ayezee`);
		const streamInfo = response;
		if (!streamInfo) return await client.say(streamerName, `${streamerName} is currently offline`);
		const timeDif = Math.abs(new Date().getTime() - new Date(streamInfo.started_at).getTime());
		await client.say(streamerName, `${streamerName} has been streaming for ${prettyMs(timeDif)}`);
	},
};
