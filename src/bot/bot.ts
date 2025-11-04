import { Bot, InlineKeyboard } from "grammy"
import * as dotenv from "dotenv"

dotenv.config({ path: '.env' });
const bot = new Bot(process.env.TELEGRAM_BOT_ID!)
let link = "";

bot.command("MemoBox", () => {
  link = "Hello World";
})


const Menu = "<b>Menu 1 </b>\n\nAdd your link to MemoBox";

const MenuMarkUp = new InlineKeyboard();

bot.command("menu", async (ctx) => {
  await ctx.reply(Menu, {
    parse_mode: "HTML",
    reply_markup: MenuMarkUp,
  })
})

bot.on("message", async (ctx) => {
  console.log(`${ctx.from.first_name} wrote ${"text" in ctx.message ? ctx.message.text : ""}
`);
})

bot.start();

