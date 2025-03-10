import { generateText, tool } from 'ai'
import z from 'zod'
import { openai } from '../ai/openai'
import { subscriptions } from '../database/drizzle/schemas/subscriptions'
import { db } from '../database/postgres'

interface AnswerUserMessageParams {
  message: string
}

export async function answerUserMessage({ message }: AnswerUserMessageParams) {
  const answer = await generateText({
    model: openai,
    prompt: message,
    tools: {
      subscribersFromDatabase: tool({
        description: 'Buscar informações dos inscritos do banco de dados',
        parameters: z.object({}),
        execute: async () => {
          const result = await db.select().from(subscriptions)
          return JSON.stringify(result)
        },
      }),
    },
    system: `
      Você é uma assistente de I.A. REsponsável por responder dúvidas sobre um evento de programação.

      Inclua na resposta somente o que p usuário pediu, sem nenhum texto adicional.

      O retorno deve ser sempre em markdown (sem incluir \'\'\' no início ou no fim).
    `.trim(),
  })

  return { response: answer.text }
}
