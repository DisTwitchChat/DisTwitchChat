import setup from "./setup";
import { addRole, removeRole } from "./misc";
import { resolveUser } from "../../utils/functions";

module.exports = async (reaction, user, DiscordClient) => {
	console.log("role removed");
	const { roleToGive, type, DMuser, role } = await setup(reaction, user);
	console.log({ roleToGive, type, DMuser, role, user });
	if (!roleToGive) return;
	let member = await reaction.message.guild.members.resolve(user);
	if (!member) {
		member = reaction.message.guild.members.cache.get(user.id);
	}
	if (!member) {
		member = resolveUser(reaction.message, user.id || user.username);
	}
	switch (type) {
		case "REMOVE_ON_REMOVE":
		case "TOGGLE":
			if (member.roles.cache.has(role)) {
				await removeRole({ role: roleToGive, member, DMuser, DiscordClient });
			}
			break;
		case "ADD_ON_REMOVE":
			if (!member.roles.cache.has(role)) {
				await addRole({ role: roleToGive, member, DMuser, DiscordClient });
			}
			break;
	}
};
