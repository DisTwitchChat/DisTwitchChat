import { Guild, Message, MessageEmbed, TextChannel, User } from "discord.js";
import { firestore } from "firebase-admin";
import { compare, isPremium } from "../../../utils/functions";
import { writeToAuditLog } from "./auditLog";

export const logMessageDelete = async (message: Message, channelIds: string[], executor: User, guild: Guild) => {
	try {
		checkDeleteReactionMessage(guild.id, message);
	} catch (err) {}
	const { channel, content, author, id } = message;

	const embed = new MessageEmbed()
		.setAuthor(executor?.tag || "Unknown Deleter", executor?.avatarURL?.())
		.setTitle("Message Deleted")
		.setThumbnail(executor?.avatarURL())
		.addField("Message Sender", `${author || "An unknown user"}`, true)
		.addField("Channel", `${channel}`, true)
		.addField("Deleted By", `${executor || "Unknown"}`, true)
		.addField("Message Content", content || "Unknown content")
		.setFooter(`ID: ${id}`)
		.setTimestamp(new Date())
		.setColor("#ee1111");

	for (const channelId of channelIds) {
		if (!channelId) return;

		const logChannel = guild.channels.resolve(channelId) as TextChannel;

		logChannel.send(embed);
	}
	if (await isPremium(guild)) {
		writeToAuditLog(guild, "message deleted", embed.toJSON());
	}
};

export const checkDeleteReactionMessage = async (guildId, message) => {
	const reactionRoleMessages = firestore().collection("reactions").doc(guildId);
	const reactionRoleMessagesRef = await reactionRoleMessages.get();
	const reactionRoleMessagesData = reactionRoleMessagesRef.data();
	if (reactionRoleMessagesData?.[message.id]) {
		reactionRoleMessages.update({ [message.id]: firestore.FieldValue.delete() });
	}
};

export const logUpdate = async (newItem, oldItem, { keyMap = {}, valueMap = {}, ignoredDifferences = [], title, footer }) => {
	const differences = compare(oldItem, newItem);
	const differenceKeys = Object.keys(differences).filter(key => !differences[key] && !ignoredDifferences.includes(key));

	const embed = new MessageEmbed().setTitle(title).setFooter(footer).setTimestamp(new Date()).setColor("#faa51b");

	for (const change of differenceKeys) {
		const newValue = valueMap[change]?.(newItem[change], true) || newItem[change] || "None";
		const oldValue = valueMap[change]?.(oldItem[change], false) || oldItem[change] || "None";
		embed.addField((keyMap[change] || change).capitalize(), `${oldValue} -> ${newValue}`);
	}

	return embed;
};
