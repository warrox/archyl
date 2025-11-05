import { generateText } from "ai"
import { xai } from "@ai-sdk/xai"
import { z } from 'zod'

const { text } = await generateText({
  model: xai("grok-4"),
  prompt: "What is love ?"
})
