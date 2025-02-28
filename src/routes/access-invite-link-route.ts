import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { env } from '../env/schema'
import { accessInviteLink } from '../functions/access-invite-link'

export const accessInviteLinkRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/invites/:subscriberId',
    {
      schema: {
        summary: 'Access invite link and redirects user',
        tags: ['Referral'],
        params: z.object({
          subscriberId: z.string(),
        }),
        response: {
          302: z.null(),
        },
      },
    },
    async (request, reply) => {
      const { subscriberId } = request.params

      const redirectUrl = new URL(env.WEB_URL)

      await accessInviteLink({ subscriberId })

      redirectUrl.searchParams.set('referrer', subscriberId)

      // 301 - redirect permanente - guardar cache
      // 302 - redirect temporário - não guardar cache

      return reply.redirect(redirectUrl.toString(), 302)
    }
  )
}
