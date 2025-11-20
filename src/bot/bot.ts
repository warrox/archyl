import { Bot, InlineKeyboard } from "grammy";
import * as dotenv from "dotenv";
import { ta } from "zod/locales";
import { Action } from "./actions.ts";
dotenv.config({ path: ".env" });

const action = new Action();
const bot = new Bot(process.env.TELEGRAM_BOT_ID!);

let vaultState: boolean = false;
// ******* MemoBox *******
bot.command("memobox", async (ctx) => {
	bot.api.sendMessage(ctx.chatId, "MemoBox wip");
	action.memoBox(bot, ctx);
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
	action.tag(bot, ctx);
});

bot.on("message", async (ctx) => {
	action.message(bot, ctx, vaultState);
});

bot.start();
