import { initTRPC } from '@trpc/server';
import { PayloadRequest } from 'payload/types';
import { User } from '@flowerchild/payload-types';

const t = initTRPC.create();
const middleware = t.middleware;

const isAuth = middleware(async ({ ctx, next }) => {
  const req = { user: null } as PayloadRequest;
  // const req = ctx.req as PayloadRequest;

  const { user } = req as { user: User | null };

  if (!user || !user.id) {
    throw new Error('Unauthorized');
  }

  return next({
    ctx: {
      user,
    },
  });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuth);
