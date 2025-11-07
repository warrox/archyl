import { Bot, InlineKeyboard } from "grammy";
import * as dotenv from "dotenv";
import { oa } from "../ai/agent.ts";
dotenv.config({ path: ".env" });
const bot = new Bot(process.env.TELEGRAM_BOT_ID!);

let usrPrompt: string = "";
export let result = "";
bot.command("MemoBox", (ctx) => {
  if (ctx.message?.text) {
    usrPrompt = ctx.message.text;
  }
});

const Menu = "<b>Menu 1 </b>\n\nAdd your link to MemoBox";

const MenuMarkUp = new InlineKeyboard();

bot.command("menu", async (ctx) => {
  await ctx.reply(Menu, {
    parse_mode: "HTML",
    reply_markup: MenuMarkUp,
  });
});

bot.on("message", async (ctx) => {
  if (ctx.message.text) {
    usrPrompt = ctx.message.text;
  }
  console.log(`${ctx.from.first_name} sent : ${usrPrompt}`);
  bot.api.sendMessage(
    ctx.chatId,
    "I'm thinking, wait here i'm coming in a few ..",
  );
  result = await oa(usrPrompt);
  console.log(`result from ChatGpt : ${result}`);
  bot.api.sendMessage(ctx.chatId, result);
});

bot.start();
