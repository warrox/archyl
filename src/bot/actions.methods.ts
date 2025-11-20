import { prismaClient } from "../../prisma/index.ts";
import { Bot, Context } from "grammy";
import type { CommandContext } from "grammy";
import { oa } from "../ai/agent.ts";
let usrPrompt = "";
let result = "";

export const tag = async (bot: Bot, ctx: CommandContext<Context>) => {
  if (ctx.message?.text) usrPrompt = ctx.message.text;
  usrPrompt = usrPrompt.slice(4);
  const [tag, ...rest] = usrPrompt.trimStart().split(" ");
  /*
    Check if the command /tag is well used by user
  */
  if (!tag) {
    bot.api.sendChatAction(ctx.chatId, "typing");
    await new Promise((r) => setTimeout(r, 1000));
    return bot.api.sendMessage(
      ctx.chatId,
      "use /tag {Your tag} + content\nexample: /tag reminder - call Steve",
    );
  }
  /* 
    Separating tag from user prompt
   */
  usrPrompt = rest.join(" ").replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "");
  console.log("Tag:", tag);
  console.log("Prompt:", usrPrompt);
  try {
    const userId = ctx.from?.id;
    if (!userId) throw new Error("User ID missing");

    let user = await prismaClient.user.findUnique({
      where: { id: userId },
    });
    /* if user doesn't exist add it  to Database User*/
    if (!user) {
      user = await prismaClient.user.create({
        data: {
          id: userId,
          name: ctx.from?.first_name || "",
        },
      });
    }
    if (ctx.from?.first_name !== user?.name) {
      await prismaClient.user.update({
        where: {
          id: ctx.from?.id,
        },
        data: {
          name: ctx.from?.first_name || "",
        },
      });
    }
    /* if prompt and tag add them to userTag Database*/
    if (usrPrompt && tag) {
      await prismaClient.userTag.create({
        data: {
          userId: user.id,
          name: tag,
          content: usrPrompt,
        },
      });
    }
  } catch (err) {
    console.error("DB Error:", err);
  }
  bot.api.sendMessage(
    ctx.chatId,
    ` Your message has been added to the vault 🔐, you can retrieve it by using 🧠MemoBox  in the category : "${tag.toUpperCase()}" or talk to me directly on the menu`,
  );
};

export const message = async (bot: Bot, ctx: any, vaultState: boolean) => {
  /* Check if it's a raw prompt or a commande line + prompt*/
  if (ctx.message?.text) {
    usrPrompt = ctx.message.text;
  } else if (ctx.message?.text?.startsWith("/", 0)) {
    return;
  }
  console.log(`${ctx.from?.first_name} sent : ${usrPrompt}`);
  if (vaultState === true) {
    bot.api.sendMessage(
      ctx.chatId,
      "I'm thinking, wait here i'm coming in a few ..",
    );
    /* Use Ai sdk to create a tag */
    result = await oa(usrPrompt);
    console.log(`result from ChatGpt : ${result}`);
    result = ` Your message has been added to the vault 🔐, you can retrieve it by using 🧠MemoBox  in the category : "${result.toUpperCase()}" or talk to me directly on the menu`;
    bot.api.sendMessage(ctx.chatId, result);
    vaultState = false;
  } else {
    bot.api.sendMessage(
      ctx.chatId,
      "Use Vault🔐 to send things or Memobox🧠 to retrieve things",
    );
  }
};

export const memoBox = async (bot: Bot, ctx: any) => {
  try {
    const usrId = ctx.from?.id;
    const tagNames = await prismaClient.userTag.findMany({
      where: { userId: usrId },
      select: { name: true },
    });
    const tagLst = tagNames.map((t) => t.name);
    console.log(
      "what's inside :",
      tagLst,
    );
    const tagLstMsg = tagLst.join(" ")
    bot.api.sendMessage(usrId, tagLstMsg);
  } catch (error) {
    console.log(error);
  }
};
