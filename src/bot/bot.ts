import { Bot, InlineKeyboard } from "grammy";
import * as dotenv from "dotenv";
import { oa } from "../ai/agent.ts";
import { prismaClient } from "../../prisma/index.ts";
import { ta } from "zod/locales";
dotenv.config({ path: ".env" });
const bot = new Bot(process.env.TELEGRAM_BOT_ID!);

let usrPrompt: string = "";
let vaultState: boolean = false;
export let result = "";
// ******* MemoBox *******
bot.command("memobox", async (ctx) => {
	bot.api.sendMessage(ctx.chatId, "MemoBox wip");
});
// ******* Vault *******
bot.command("vault", async (ctx) => {
	bot.api.sendMessage(
		ctx.chatId,
		"Vault opened🔓, please send me your memo ..",
	);
	vaultState = true;
});

// ****** Tag *******

bot.command("tag", async (ctx) => {
	if (ctx.message?.text) usrPrompt = ctx.message.text;
	usrPrompt = usrPrompt.slice(4);
	const [tag, ...rest] = usrPrompt.trimStart().split(" ");

	if (!tag) {
		bot.api.sendChatAction(ctx.chatId, "typing");
		await new Promise((r) => setTimeout(r, 1000));
		return bot.api.sendMessage(
			ctx.chatId,
			"use /tag {Your tag} + content\nexample: /tag reminder - call Steve",
		);
	}

	usrPrompt = rest.join(" ").replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, "");
	console.log("Tag:", tag);
	console.log("Prompt:", usrPrompt);

	try {
		const user = await prismaClient.user.findUnique({
			where: {
				id: ctx.from?.id,
			},
		});
		console.log("RRRRRRR");
		if (user) {
			// put tag and content
			if (usrPrompt && tag) {
				await prismaClient.user.update({
					where: { id: ctx.from?.id },
					data: {
						tag: tag,
						content: usrPrompt,
					},
				});
				console.log("ADEED");
			}
		} else {
			await prismaClient.user.create({
				data: {
					id: ctx.from?.id || 0,
					name: ctx.from?.first_name || "salut",
				},
			});
			console.log("XXXXXXX");
		}
	} catch (err) {
		console.error("DB Error:", err);
	}
});

bot.on("message", async (ctx) => {
	if (ctx.message.text) {
		usrPrompt = ctx.message.text;
	} else if (ctx.message.text?.startsWith("/", 0)) {
		return;
	}
	console.log(`${ctx.from.first_name} sent : ${usrPrompt}`);
	if (vaultState === true) {
		bot.api.sendMessage(
			ctx.chatId,
			"I'm thinking, wait here i'm coming in a few ..",
		);
		result = await oa(usrPrompt);
		console.log(`result from ChatGpt : ${result}`);
		result = ` Your message has been added to the vault 🔐, you can retrieve it by using 🧠MemoBox  in the category : "${result.toUpperCase()}" or talk to me diectly on the menu`;
		bot.api.sendMessage(ctx.chatId, result);
		vaultState = false;
	} else {
		bot.api.sendMessage(
			ctx.chatId,
			"Use vault🔐 to send things or memobox🧠 to retrieve things",
		);
	}
});

bot.start();
